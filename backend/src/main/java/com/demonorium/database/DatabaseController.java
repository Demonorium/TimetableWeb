package com.demonorium.database;


import com.demonorium.database.entity.*;
import com.demonorium.database.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DatabaseController {
    @Autowired
    public CallScheduleRepository schedule;
    @Autowired
    public DayRepository day;
    @Autowired
    public HMStampRepository hmstamp;
    @Autowired
    public LessonRepository lesson;
    @Autowired
    public LessonTemplateRepository lessonTemplate;
    @Autowired
    public PlaceRepository place;
    @Autowired
    public SourceRepository source;
    @Autowired
    public TeacherRepository teacher;
    @Autowired
    public UserRepository user;
    @Autowired
    public WeekRepository week;
    @Autowired
    public AccessTokenRepository token;
    @Autowired
    public ShareReferenceRepository reference;

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

    public boolean access(User user, Teacher teacher, Rights rights) {
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
        if (source.getOwner().equals(user)) return true;
        Optional<AccessToken> access = token.findByUserAndReference_Source(user, source);
        return access.filter(accessToken -> Rights.compatible(accessToken.getReference().getRights(), rights)).isPresent();
    }
}
