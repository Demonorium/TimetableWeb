package com.demonorium.database;


import com.demonorium.database.entity.*;
import com.demonorium.database.repository.*;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Getter
public class DatabaseServiceImpl implements DatabaseService {
    @Autowired
    private CallScheduleRepository schedules;
    @Autowired
    private DayRepository days;
    @Autowired
    private HMStampRepository hmstamps;
    @Autowired
    private LessonRepository lessons;
    @Autowired
    private LessonTemplateRepository lessonTemplates;
    @Autowired
    private PlaceRepository places;
    @Autowired
    private SourceRepository sources;
    @Autowired
    private TeacherRepository teachers;
    @Autowired
    private UserRepository users;
    @Autowired
    private WeekRepository weeks;
    @Autowired
    private AccessTokenRepository tokens;
    @Autowired
    private ShareReferenceRepository references;

    @Autowired
    private SourcesPriorityRepository sourcesPriorities;

    @Override
    public boolean access(User user, SourcesPriority priority, Rights rights) {
        return access(user, priority.getSource(), rights);
    }

    @Override
    public boolean access(User user, CallSchedule schedule, Rights rights) {
        return access(user, schedule.getSource(), rights);
    }
    @Override
    public boolean access(User user, Day day, Rights rights) {
        return access(user, day.getSource(), rights);
    }
    @Override
    public boolean access(User user, HMStamp stamp, Rights rights) {
        return access(user, stamp.getSchedule(), rights);
    }
    @Override
    public boolean access(User user, Lesson lesson, Rights rights) {
        return access(user, lesson.getDay(), rights);
    }
    @Override
    public boolean access(User user, LessonTemplate lessonTemplate, Rights rights) {
        return access(user, lessonTemplate.getSource(), rights);
    }
    @Override
    public boolean access(User user, Place place, Rights rights) {
        return access(user, place.getSource(), rights);
    }

    @Override
    public boolean access(User user, Teacher teacher, Rights rights) {
        return access(user, teacher.getSource(), rights);
    }
    @Override
    public boolean access(User user, Week week, Rights rights) {
        return access(user, week.getSource(), rights);
    }

    @Override
    public boolean access(User user, AccessToken token, Rights rights) {
        return token.getUser() == user;
    }

    @Override
    public boolean access(User user, Source source, Rights rights) {
        if (user == null) return false;
        if (source == null) return false;
        if (rights == null) return false;
        if (source.getOwner().equals(user)) return true;
        Optional<AccessToken> access = getTokens().findByUserAndReference_Source(user, source);

        return access.filter(accessToken -> Rights.compatible(accessToken.getReference().getRights(), rights)).isPresent();
    }
}
