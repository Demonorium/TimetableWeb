package com.demonorium.web;

import com.demonorium.database.DatabaseController;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@CrossOrigin
public class CrudApiController {
    @Autowired
    DatabaseController database;

    @Autowired
    WebUtils utils;

    boolean access(HttpServletRequest request, CallSchedule schedule, Rights rights) {
        return database.access(utils.getUser(request), schedule, rights);
    }
    boolean access(HttpServletRequest request, Day day, Rights rights) {
        return database.access(utils.getUser(request), day, rights);
    }
    boolean access(HttpServletRequest request, HMStamp stamp, Rights rights) {
        return database.access(utils.getUser(request), stamp, rights);
    }
    boolean access(HttpServletRequest request, Lesson lesson, Rights rights) {
        return database.access(utils.getUser(request), lesson, rights);
    }
    boolean access(HttpServletRequest request, LessonTemplate lessonTemplate, Rights rights) {
        return database.access(utils.getUser(request), lessonTemplate, rights);
    }
    boolean access(HttpServletRequest request, Place place, Rights rights) {
        return database.access(utils.getUser(request), place, rights);
    }
    boolean access(HttpServletRequest request, Source source, Rights rights) {
        return database.access(utils.getUser(request), source, rights);
    }
    boolean access(HttpServletRequest request, Teacher teacher, Rights rights) {
        return database.access(utils.getUser(request), teacher, rights);
    }
    boolean access(HttpServletRequest request, Week week, Rights rights) {
        return database.access(utils.getUser(request), week, rights);
    }

    //TODO: REMOVE
    @GetMapping("/testRun")
    ResponseEntity<String> testRun(HttpServletRequest request, @RequestParam(name="name") String name) {
        User user =  new User("admin", "hello");
        database.user.save(user);

        Source source = new Source(user);
        database.source.save(source);

        Teacher teacher = new Teacher(source, name, "no note");
        database.teacher.save(teacher);
        return ResponseEntity.ok("NORMAL");
    }


    @GetMapping("/api/edit/schedule")
    ResponseEntity<CallSchedule> editSchedule(HttpServletRequest request, @RequestParam(name="id", required = false) Long id, @RequestParam("source") Long source) {
        Optional<Source> object = database.source.findById(source);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.UPDATE)) {
            Optional<CallSchedule> schedule = database.schedule.findById(id);
            if (schedule.isPresent()) {
                return ResponseEntity.unprocessableEntity().build();
            }
            CallSchedule newSchedule = new CallSchedule(object.get());
            database.schedule.save(newSchedule);

            return ResponseEntity.ok(newSchedule);
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/edit/day")
    ResponseEntity<Day> editDay(HttpServletRequest request,
                                              @RequestParam(name="id", required = false) Long id,
                                              @RequestParam("source") Long source,
                                              @RequestParam(value = "scheduleId", required = false) Long scheduleId) {
        Optional<Source> object = database.source.findById(source);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.UPDATE)) {
            CallSchedule schedule = null;
            {
                Optional<CallSchedule> temp = database.schedule.findById(scheduleId);
                if (temp.isPresent())
                    schedule = temp.get();
            }
            if (schedule == null) {
                schedule = object.get().getDefaultSchedule();
            }
            if (schedule != null) {
                Day day = null;
                if (id != null) {
                    Optional<Day> temp = database.day.findById(id);
                    if (temp.isPresent())
                        day = temp.get();
                }
                if (day == null)
                    day = new Day();
                day.setSource(object.get());
                day.setSchedule(schedule);
                database.day.save(day);
                return ResponseEntity.ok(day);

            } else
                return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/schedule")
    ResponseEntity<CallSchedule> findSchedule(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<CallSchedule> object = database.schedule.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }


    @GetMapping("/api/find/day")
    ResponseEntity<Day> findDay(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Day> object = database.day.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/lesson")
    ResponseEntity<Lesson> findLesson(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Lesson> object = database.lesson.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/lesson_template")
    ResponseEntity<LessonTemplate> findLessonTemplate(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<LessonTemplate> object = database.lessonTemplate.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/place")
    ResponseEntity<Place> findPlace(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Place> object = database.place.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/source")
    ResponseEntity<Source> findSource(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Source> object = database.source.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/teacher")
    ResponseEntity<Teacher> findTeacher(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Teacher> object = database.teacher.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/week")
    ResponseEntity<Week> findWeek(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Week> object = database.week.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }
}
