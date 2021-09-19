package com.demonorium.web;

import com.demonorium.database.entity.*;
import com.demonorium.database.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Controller
public class WebAPIController {
    @Autowired
    CallScheduleRepository scheduleRepository;
    @Autowired
    DayRepository dayRepository;
    @Autowired
    HMStampRepository hmStampRepository;
    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    LessonTemplateRepository lessonTemplateRepository;
    @Autowired
    PlaceRepository placeRepository;
    @Autowired
    SourceRepository sourceRepository;
    @Autowired
    TeacherRepository teacherRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    WeekRepository weekRepository;

    User getUser(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        if (principal == null)
            return null;
        Optional<User> user = userRepository.findById(principal.getName());
        return user.orElse(null);
    }

    boolean access(HttpServletRequest request, CallSchedule schedule) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }
    boolean access(HttpServletRequest request, Day day) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }
    boolean access(HttpServletRequest request, HMStamp stamp) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }
    boolean access(HttpServletRequest request, Lesson lesson) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }
    boolean access(HttpServletRequest request, LessonTemplate lessonTemplate) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }
    boolean access(HttpServletRequest request, Place place) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }
    boolean access(HttpServletRequest request, Source source) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }
    boolean access(HttpServletRequest request, Teacher teacher) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }
    boolean access(HttpServletRequest request, Week week) {
        User user = getUser(request);
        if (user != null) {

        }
        return true;
    }

    //TODO: REMOVE
    @GetMapping("/testRun")
    ResponseEntity<String> testRun(HttpServletRequest request, @RequestParam(name="name") String name) {
        User user =  new User("admin", "hello");
        userRepository.save(user);

        Source source = new Source(user);
        sourceRepository.save(source);

        CallSchedule schedule = new CallSchedule(source);
        scheduleRepository.save(schedule);

        Teacher teacher = new Teacher(source, name, "no note");
        teacherRepository.save(teacher);
        return ResponseEntity.ok("NORMAL");
    }


    @GetMapping("/api/edit/schedule")
    ResponseEntity<CallSchedule> editSchedule(HttpServletRequest request, @RequestParam(name="id") Long id, @RequestParam("source") Long source) {
        Optional<Source> object = sourceRepository.findById(source);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            Optional<CallSchedule> schedule = scheduleRepository.findById(id);
            if (schedule.isPresent()) {
                return ResponseEntity.unprocessableEntity().build();
            }
            CallSchedule newSchedule = new CallSchedule(object.get());
            scheduleRepository.save(newSchedule);

            return ResponseEntity.ok(newSchedule);
        }
        return ResponseEntity.unprocessableEntity().build();
    }


    @GetMapping("/api/find/schedule")
    ResponseEntity<CallSchedule> findSchedule(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<CallSchedule> object = scheduleRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }


    @GetMapping("/api/find/day")
    ResponseEntity<Day> findDay(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Day> object = dayRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/lesson")
    ResponseEntity<Lesson> findLesson(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Lesson> object = lessonRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/lesson_template")
    ResponseEntity<LessonTemplate> findLessonTemplate(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<LessonTemplate> object = lessonTemplateRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/place")
    ResponseEntity<Place> findPlace(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Place> object = placeRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/source")
    ResponseEntity<Source> findSource(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Source> object = sourceRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/teacher")
    ResponseEntity<Teacher> findTeacher(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Teacher> object = teacherRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/week")
    ResponseEntity<Week> findWeek(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<Week> object = weekRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(object.get());
        }
        return ResponseEntity.unprocessableEntity().build();
    }
}
