package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;


@RestController
public class UserAuthController {
    @Autowired
    private DatabaseService database;

    @Autowired
    private UserAuthentication authentication;
    @Autowired
    private WebUtils utils;


    @GetMapping("/user/register")
    ResponseEntity<String> register(HttpServletRequest request,
                                     @RequestParam("username") String username,
                                     @RequestParam("password") String password) {
        User user = authentication.newUser(username, password);
        if (user != null) {
            //todo: remove
            Source source = new Source(user);
            database.getSources().save(source);
            CallSchedule schedule = new CallSchedule(source);
            database.getSchedules().save(schedule);
            source.setDefaultSchedule(schedule);
            database.getSources().save(source);
            {
                HMStamp stamp = new HMStamp((byte) 10, (byte) 0, schedule);
                database.getHmstamps().save(stamp);
            }
            {
                HMStamp stamp = new HMStamp((byte) 10, (byte) 40, schedule);
                database.getHmstamps().save(stamp);
            }
            {
                HMStamp stamp = new HMStamp((byte) 20, (byte) 10, schedule);
                database.getHmstamps().save(stamp);
            }
            {
                HMStamp stamp = new HMStamp((byte) 20, (byte) 50, schedule);
                database.getHmstamps().save(stamp);
            }


            LessonTemplate template = new LessonTemplate("Тестовый урок", "Заметка об уроке", source);
            database.getLessonTemplates().save(template);

            Place place = new Place("324", "6k", "лучший кабинет", source);
            database.getPlaces().save(place);

            Day day = new Day(source, new Date());
            database.getDays().save(day);

            {
                Lesson lesson = new Lesson(template, day, place, 0);
                database.getLessons().save(lesson);
            }
            {
                Lesson lesson = new Lesson(template, day, place, 1);
                database.getLessons().save(lesson);
            }

            byte[] encoded = Base64.getEncoder()
                    .encode((username + ':' + password)
                            .getBytes(StandardCharsets.UTF_8));
            return ResponseEntity.ok(new String(encoded, StandardCharsets.UTF_8));
        }
        return ResponseEntity.badRequest().body("duplicate username");
    }
}
