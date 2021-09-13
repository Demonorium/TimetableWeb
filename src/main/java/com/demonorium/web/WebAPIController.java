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

    @GetMapping("/api/find/schedule")
    ResponseEntity<List<HMStamp>> findSchedule(HttpServletRequest request, @RequestParam(name="id") long id) {
        Optional<CallSchedule> object = scheduleRepository.findById(id);
        if (!object.isPresent())
            return ResponseEntity.notFound().build();

        if (access(request, object.get())) {
            return ResponseEntity.ok(new ArrayList<>(object.get().getSchedule()));
        }
        return ResponseEntity.unprocessableEntity().build();
    }



}
