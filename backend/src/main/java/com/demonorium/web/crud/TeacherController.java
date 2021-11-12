package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.Teacher;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
public class TeacherController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/create/teacher")
    ResponseEntity<Long> createTeacher(HttpServletRequest request,
                                       @RequestParam(name="sourceId") Long id,
                                       @RequestParam(name="note", required = false) String note,
                                       @RequestParam(name="name") String name,
                                       @RequestParam(name="position") String position) {

        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.UPDATE)) {
            Teacher teacher = new Teacher(name, position, note, source.get());

            return ResponseEntity.ok(databaseService.getTeacherRepository().save(teacher).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/update/teacher")
    ResponseEntity<String> updateTeacher(HttpServletRequest request,
                                         @RequestParam(name="id") Long id,
                                         @RequestParam(name="note", required = false) String note,
                                         @RequestParam(name="name") String name,
                                         @RequestParam(name="position") String position) {

        Optional<Teacher> teacher = databaseService.getTeacherRepository().findById(id);

        if (!teacher.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, teacher, Rights.UPDATE)) {
            teacher.get().setName(name);
            teacher.get().setPosition(position);
            teacher.get().setNote(note);
            databaseService.getTeacherRepository().save(teacher.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/delete/teacher")
    ResponseEntity<String> deleteTeacher(HttpServletRequest request,
                                         @RequestParam(name="id") Long id) {

        Optional<Teacher> teacher = databaseService.getTeacherRepository().findById(id);

        if (!teacher.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, teacher, Rights.DELETE)) {
            databaseService.getTeacherRepository().delete(teacher.get());
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}
