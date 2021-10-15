package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class CrudApiController {
    @Autowired
    DatabaseService database;

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
    boolean access(HttpServletRequest request, SourcesPriority priority, Rights rights) {
        return database.access(utils.getUser(request), priority, rights);
    }


    @GetMapping("/api/edit/schedule")
    ResponseEntity<CallSchedule> editSchedule(HttpServletRequest request, @RequestParam(name="id", required = false) Long id, @RequestParam("source") Long source) {
        Optional<Source> object = database.getSources().findById(source);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.UPDATE)) {
            Optional<CallSchedule> schedule = database.getSchedules().findById(id);
            if (schedule.isPresent()) {
                return ResponseEntity.unprocessableEntity().build();
            }
            CallSchedule newSchedule = new CallSchedule(object.get());
            database.getSchedules().save(newSchedule);

            return ResponseEntity.ok(newSchedule);
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/edit/day")
    ResponseEntity<Day> editDay(HttpServletRequest request,
                                              @RequestParam(name="id", required = false) Long id,
                                              @RequestParam("source") Long source,
                                              @RequestParam(value = "scheduleId", required = false) Long scheduleId) {
        Optional<Source> object = database.getSources().findById(source);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.UPDATE)) {
            CallSchedule schedule = null;
            {
                Optional<CallSchedule> temp = database.getSchedules().findById(scheduleId);
                if (temp.isPresent())
                    schedule = temp.get();
            }
            if (schedule == null) {
                schedule = object.get().getDefaultSchedule();
            }
            if (schedule != null) {
                Day day = null;
                if (id != null) {
                    Optional<Day> temp = database.getDays().findById(id);
                    if (temp.isPresent())
                        day = temp.get();
                }
                if (day == null)
                    day = new Day();
                day.setSource(object.get());
                day.setSchedule(schedule);
                database.getDays().save(day);
                return ResponseEntity.ok(day);

            } else
                return ResponseEntity.internalServerError().build();
        }
        return ResponseEntity.unprocessableEntity().build();
    }


    @GetMapping("/api/find/all")
    ResponseEntity<List<Source>> findAll(HttpServletRequest request) {
        User user = utils.getUser(request);

        if (user != null) {
            List<Source> sources = user.getSources();
            List<Source> result = new ArrayList<>(sources);
            Set<AccessToken> tokens = user.getTokens();
            tokens.forEach((accessToken -> result.add(accessToken.getReference().getSource())));

            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/api/find/priority")
    ResponseEntity<SourcesPriority> findPriority(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<SourcesPriority> object = database.getSourcesPriorities().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/schedule")
    ResponseEntity<CallSchedule> findSchedule(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<CallSchedule> object = database.getSchedules().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }



    @GetMapping("/api/find/day")
    ResponseEntity<Day> findDay(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Day> object = database.getDays().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/lesson")
    ResponseEntity<Lesson> findLesson(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Lesson> object = database.getLessons().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/lesson_template")
    ResponseEntity<LessonTemplate> findLessonTemplate(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<LessonTemplate> object = database.getLessonTemplates().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/place")
    ResponseEntity<Place> findPlace(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Place> object = database.getPlaces().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/source")
    ResponseEntity<Source> findSource(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Source> object = database.getSources().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/teacher")
    ResponseEntity<Teacher> findTeacher(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Teacher> object = database.getTeachers().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/week")
    ResponseEntity<Week> findWeek(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Week> object = database.getWeeks().findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get(), Rights.READ)) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }
}
