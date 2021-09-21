package com.demonorium.web;


import com.demonorium.database.Rights;
import com.demonorium.database.entity.*;
import com.demonorium.database.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Controller
public class DatabaseController {
    @Autowired
    CallScheduleRepository schedule;
    @Autowired
    DayRepository day;
    @Autowired
    HMStampRepository hmstamp;
    @Autowired
    LessonRepository lesson;
    @Autowired
    LessonTemplateRepository lessonTemplate;
    @Autowired
    PlaceRepository place;
    @Autowired
    SourceRepository source;
    @Autowired
    TeacherRepository teacher;
    @Autowired
    UserRepository user;
    @Autowired
    WeekRepository week;
    @Autowired
    AccessTokenRepository token;
    @Autowired
    ShareReference reference;

    public boolean access(User user, CallSchedule schedule, Rights rights) {
        return access(user, schedule.getSource(), rights);
    }
    public boolean access(User user, Day day, Rights rights) {
        return access(user, day.getSource(), rights);
    }
    public boolean access(User user, HMStamp stamp, Rights rights) {
        return access(user, stamp.getSchedule(), rights);
    }
    public boolean access(User user, Lesson lesson, Rights rights) {
        return access(user, lesson.getDay(), rights);
    }
    public boolean access(User user, LessonTemplate lessonTemplate, Rights rights) {
        return access(user, lessonTemplate.getSource(), rights);
    }
    public boolean access(User user, Place place, Rights rights) {
        return access(user, place.getSource(), rights);
    }

    boolean access(User user, Teacher teacher, Rights rights) {
        return access(user, teacher.getSource(), rights);
    }
    public boolean access(User user, Week week, Rights rights) {
        return access(user, week.getSource(), rights);
    }

    public boolean access(User user, AccessToken token, Rights rights) {
        return token.getUser() == user;
    }

    public boolean access(User user, Source source, Rights rights) {
        if (user == null) return false;
        if (source == null) return false;
        if (rights == null) return false;
        if (source.getOwner() == user) return true;
        Optional<AccessToken> access = token.findByUserAndReference_Source(user, source);
        return access.filter(accessToken -> Rights.compatible(accessToken.getReference().getRights(), rights)).isPresent();
    }
}
