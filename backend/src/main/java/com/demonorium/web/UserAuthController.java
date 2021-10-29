package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Optional;


@RestController
public class UserAuthController {
    @Autowired
    private DatabaseService database;

    @Autowired
    private UserAuthentication authentication;

    @GetMapping("/user/login")
    ResponseEntity<String> login(@RequestParam("username") String username,
                                 @RequestParam("password") String password) {
        Optional<User> user = database.getUserRepository().findByUsername(username);
        if (user.isPresent()) {
            if (authentication.checkPassword(user.get().getPassword(), password)) {
                return ResponseEntity.ok().body("success");
            } else {
                return ResponseEntity.badRequest().body("password incorrect");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/register")
    ResponseEntity<String> register(@RequestParam("username") String username,
                                    @RequestParam("password") String password) {
        User user = authentication.newUser(username, password);

        if (user != null) {
            //todo: remove

            //Создаём источник
            Source source = new Source(user);
            database.getSourceRepository().save(source);

            //Создаём расписание звонков поумолчанию
            CallSchedule schedule = new CallSchedule(source);
            schedule = database.getCallScheduleRepository().save(schedule);

            source.setDefaultSchedule(schedule);
            database.getSourceRepository().save(source);

            //Наполняем расписание 4 звонками для 2 уроков
            //10:00 - 10:40
            //20:10 - 20:50

            {
                CallPair call = new CallPair(schedule, (byte) 10, (byte) 0);
                database.getCallPairRepository().save(call);
            }
            {
                CallPair call = new CallPair(schedule, (byte) 10, (byte) 40);
                database.getCallPairRepository().save(call);
            }
            {
                CallPair call = new CallPair(schedule, (byte) 20, (byte) 10);
                database.getCallPairRepository().save(call);
            }
            {
                CallPair call = new CallPair(schedule, (byte) 20, (byte) 50);
                database.getCallPairRepository().save(call);
            }

            //Создаём шаблон занятия
            LessonTemplate template = new LessonTemplate("Тестовый урок", "Заметка об уроке", source);
            database.getLessonTemplateRepository().save(template);

            //Создаём место занятия
            Place place = new Place("324", "6К", "Лучший кабинет", source);
            database.getPlaceRepository().save(place);

            //Создаём описание дня
            Day day = new Day(source, schedule);
            database.getDayRepository().save(day);

            {
                Lesson lesson = new Lesson(template, day, place, 0);
                database.getLessonRepository().save(lesson);
            }
            {
                Lesson lesson = new Lesson(template, day, place, 1);
                database.getLessonRepository().save(lesson);
            }

            //Создаём дату (текущий день)
            YearDayPair yearDayPair = new YearDayPair(new Date());
            database.getYearDayPairRepository().save(yearDayPair);

            //Создаём изменений в расписании на сегодня
            TimetableChanges changes = new TimetableChanges(source, yearDayPair, day);
            database.getTimetableChangesRepository().save(changes);

            //Добавляем текущее расписание в отображаемые, как 0
            database.getSourcesPriorityRepository().save(new SourcesPriority(user, source, 0));

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.badRequest().body("duplicate username");
    }
}
