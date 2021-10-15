package com.demonorium.database;

import com.demonorium.database.entity.*;

public interface DatabaseService {
    boolean access(User user, SourcesPriority priority, Rights rights);

    boolean access(User user, CallSchedule schedule, Rights rights);

    boolean access(User user, Day day, Rights rights);

    boolean access(User user, HMStamp stamp, Rights rights);

    boolean access(User user, Lesson lesson, Rights rights);

    boolean access(User user, LessonTemplate lessonTemplate, Rights rights);

    boolean access(User user, Place place, Rights rights);

    boolean access(User user, Teacher teacher, Rights rights);

    boolean access(User user, Week week, Rights rights);

    boolean access(User user, AccessToken token, Rights rights);

    boolean access(User user, Source source, Rights rights);

    com.demonorium.database.repository.CallScheduleRepository getSchedules();

    com.demonorium.database.repository.DayRepository getDays();

    com.demonorium.database.repository.HMStampRepository getHmstamps();

    com.demonorium.database.repository.LessonRepository getLessons();

    com.demonorium.database.repository.LessonTemplateRepository getLessonTemplates();

    com.demonorium.database.repository.PlaceRepository getPlaces();

    com.demonorium.database.repository.SourceRepository getSources();

    com.demonorium.database.repository.TeacherRepository getTeachers();

    com.demonorium.database.repository.UserRepository getUsers();

    com.demonorium.database.repository.WeekRepository getWeeks();

    com.demonorium.database.repository.AccessTokenRepository getTokens();

    com.demonorium.database.repository.ShareReferenceRepository getReferences();

    com.demonorium.database.repository.SourcesPriorityRepository getSourcesPriorities();
}
