package com.demonorium.web.crud;


import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.LessonTemplate;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.Teacher;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
public class LessonTemplateController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/create/lessonTemplate")
    ResponseEntity<Long> createLessonTemplate(HttpServletRequest request,
                                              @RequestParam(name="sourceId") Long id,
                                              @RequestParam(name="note", required = false) String note,
                                              @RequestParam(name="name") String name,
                                              @RequestParam(name="hours") Integer hours,
                                              @RequestParam(name="defaultTeachers[]", required = false) List<Long> teachers) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.UPDATE)) {
            LessonTemplate template = new LessonTemplate(name, note, hours, source.get());

            if (teachers != null) {
                for (Long teacherId : teachers) {
                    Optional<Teacher> teacher = databaseService.getTeacherRepository().findById(teacherId);
                    if (teacher.isPresent() && webUtils.hasAccess(request, teacher, Rights.READ)) {
                        template.addTeacher(teacher.get());
                    }
                }
            }

            return ResponseEntity.ok(databaseService.getLessonTemplateRepository().save(template).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/update/lessonTemplate")
    ResponseEntity<String> updateLessonTemplate(HttpServletRequest request,
                                                @RequestParam(name="id") Long id,
                                                @RequestParam(name="note", required = false) String note,
                                                @RequestParam(name="name") String name,
                                                @RequestParam(name="hours") Integer hours,
                                                @RequestParam(name="defaultTeachers[]", required = false) List<Long> teachers) {

        Optional<LessonTemplate> template = databaseService.getLessonTemplateRepository().findById(id);

        if (!template.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, template, Rights.UPDATE)) {
            LessonTemplate current = template.get();

            current.setName(name);
            current.setHours(hours);
            current.setNote(note);

            Set<Teacher> toRemove = new HashSet<>();

            if (teachers != null) {
                TreeSet<Long> set = new TreeSet<>(teachers);


                for (Teacher teacher : current.getDefaultTeachers()) {
                    if (!set.contains(teacher.getId())) {
                        toRemove.add(teacher);
                    } else {
                        set.remove(teacher.getId());
                    }
                }

                for (Teacher teacher : toRemove)
                    current.removeTeacher(teacher);

                for (Long teacherId : set) {
                    Optional<Teacher> teacher = databaseService.getTeacherRepository().findById(teacherId);
                    if (teacher.isPresent() && webUtils.hasAccess(request, teacher, Rights.READ)) {
                        current.addTeacher(teacher.get());
                    }
                }
            } else {
                toRemove.addAll(current.getDefaultTeachers());
                for (Teacher teacher : toRemove) {
                    current.removeTeacher(teacher);
                }
            }

            databaseService.getLessonTemplateRepository().save(current);

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/delete/lessonTemplate")
    ResponseEntity<String> deleteLessonTemplate(HttpServletRequest request,
                                       @RequestParam(name="id") Long id) {

        Optional<LessonTemplate> template = databaseService.getLessonTemplateRepository().findById(id);

        if (!template.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, template, Rights.DELETE)) {
            databaseService.getLessonTemplateRepository().delete(template.get());
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}
