package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.*;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
public class DayController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/part-update/day/timetable")
    ResponseEntity<String> partUpdateDayTimetable(HttpServletRequest request,
                                                  @RequestParam(name="id") Long id,
                                                  @RequestParam(name="schedule[]", required = false) List<Integer> schedule) {
        Optional<Day> day = databaseService.getDayRepository().findById(id);

        if (!day.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, day, Rights.UPDATE)) {
            CallSchedule sc = day.get().getSchedule();

            if ((sc == null) && (schedule != null) && !schedule.isEmpty()) {
                sc = new CallSchedule();
                sc.setSource(day.get().getSource());
                sc = databaseService.getCallScheduleRepository().save(sc);
                day.get().setSchedule(sc);
                databaseService.getDayRepository().save(day.get());
                sc = databaseService.getCallScheduleRepository().findById(sc.getId()).get();
            }

            if (sc != null) {
                for (CallPair pair: sc.getSchedule()) {
                    databaseService.getCallPairRepository().delete(pair);
                }

                if (schedule != null) {
                    for (Integer time : schedule) {
                        CallPair pair = new CallPair();
                        pair.setSchedule(sc);
                        pair.setTime((short) (int) time);
                        databaseService.getCallPairRepository().save(pair);
                    }
                }
            }

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/part-update/day/lessonsOrder")
    ResponseEntity<String> updateLessonOrder(HttpServletRequest request,
                                        @RequestParam(name="day") Long dayId,
                                        @RequestParam(name="lessons[]") List<Long> lessons) {
        Optional<Day> day = databaseService.getDayRepository().findById(dayId);

        if (!day.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, day, Rights.UPDATE)) {
            int counter = 0;

            for (Long lessonId : lessons) {
                if (lessonId != -1) {
                    Optional<Lesson> lesson = databaseService.getLessonRepository().findById(lessonId);

                    if (lesson.isPresent() && (lesson.get().getDayId().equals(dayId))) {
                        lesson.get().setNumber(counter);
                        databaseService.getLessonRepository().save(lesson.get());
                    }
                }
                ++counter;
            }

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/part-delete/day/lessons")
    ResponseEntity<String> partDeleteDayLessons(HttpServletRequest request,
                                             @RequestParam(name="day") Long dayId) {
        Optional<Day> day = databaseService.getDayRepository().findById(dayId);

        if (!day.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, day, Rights.DELETE)) {
            databaseService.getLessonRepository().deleteByDay(day.get());
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }



    @GetMapping("/api/update/lesson")
    ResponseEntity<String> updateLesson(HttpServletRequest request,
                                     @RequestParam(name="id") Long id,
                                     @RequestParam(name="template") Long templateId,
                                     @RequestParam(name="place") Long placeId,
                                     @RequestParam(name="teachers[]", required = false) List<Long> teachers) {
        Optional<Lesson> lesson = databaseService.getLessonRepository().findById(id);

        if (!lesson.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, lesson, Rights.UPDATE)) {
            {
                Optional<Place> place = databaseService.getPlaceRepository().findById(placeId);
                if (!place.isPresent()) {
                    return ResponseEntity.badRequest().body("place not found");
                }
                if (!webUtils.hasAccess(request, place, Rights.READ)) {
                    return ResponseEntity.badRequest().body("place not available");
                }
                lesson.get().setPlace(place.get());
            }

            {
                Optional<LessonTemplate> template = databaseService.getLessonTemplateRepository().findById(templateId);
                if (!template.isPresent()) {
                    return ResponseEntity.badRequest().body("template not found");
                }
                if (!webUtils.hasAccess(request, template, Rights.READ)) {
                    return ResponseEntity.badRequest().body("template not available");
                }
                lesson.get().setTemplate(template.get());
            }

            Set<Teacher> toRemove = new HashSet<>();

            if (teachers != null) {
                TreeSet<Long> set = new TreeSet<>(teachers);

                for (Teacher teacher : lesson.get().getTeachers()) {
                    if (!set.contains(teacher.getId())) {
                        toRemove.add(teacher);
                    } else {
                        set.remove(teacher.getId());
                    }
                }

                for (Teacher teacher : toRemove) {
                    lesson.get().removeTeacher(teacher);
                }

                for (Long teacherId : set) {
                    Optional<Teacher> teacher = databaseService.getTeacherRepository().findById(teacherId);
                    if (teacher.isPresent() && webUtils.hasAccess(request, teacher, Rights.READ)) {
                        lesson.get().addTeacher(teacher.get());
                    }
                }
            } else {
                toRemove.addAll(lesson.get().getTeachers());
                for (Teacher teacher : toRemove) {
                    lesson.get().removeTeacher(teacher);
                }
            }

            databaseService.getLessonRepository().save(lesson.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }
    @GetMapping("/api/create/lesson")
    ResponseEntity<Long> createLesson(HttpServletRequest request,
                                        @RequestParam(name="day") Long dayId,
                                        @RequestParam(name="template") Long templateId,
                                        @RequestParam(name="place") Long placeId,
                                        @RequestParam(name="teachers[]", required = false) List<Long> teachers) {
        Optional<Day> day = databaseService.getDayRepository().findById(dayId);

        if (!day.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, day, Rights.UPDATE)) {
            Lesson lesson = new Lesson();
            {
                Optional<Place> place = databaseService.getPlaceRepository().findById(placeId);
                if (!place.isPresent() || !webUtils.hasAccess(request, place, Rights.READ)) {
                    return ResponseEntity.badRequest().build();
                }

                lesson.setPlace(place.get());
            }
            {
                Optional<LessonTemplate> template = databaseService.getLessonTemplateRepository().findById(templateId);
                if (!template.isPresent() || !webUtils.hasAccess(request, template, Rights.READ)) {
                    return ResponseEntity.badRequest().build();
                }

                lesson.setTemplate(template.get());
            }

            lesson.setDay(day.get());

            if (teachers != null) {
                for (Long teacherId : teachers) {
                    Optional<Teacher> teacher = databaseService.getTeacherRepository().findById(teacherId);
                    if (teacher.isPresent() && webUtils.hasAccess(request, teacher, Rights.READ)) {
                        lesson.addTeacher(teacher.get());
                    }
                }
            }

            lesson.setNumber(0);

            return ResponseEntity.ok(databaseService.getLessonRepository().save(lesson).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}
