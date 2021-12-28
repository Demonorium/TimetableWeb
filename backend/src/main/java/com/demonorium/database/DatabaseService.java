package com.demonorium.database;

import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.User;
import com.demonorium.database.repository.*;

public interface DatabaseService {
    /**
     * Проверяет есть ли у пользователя запрашиваемые права на объект
     * @param user пользователь
     * @param partOfSource объект
     * @param rights запрашиваемые права
     * @return
     */
    boolean hasAccess(User user, PartOfSource partOfSource, Rights rights);

    /**
     * Проверяет есть ли у пользователя запрашиваемые права на источник
     * @param user пользователь
     * @param source источник
     * @param rights запрашиваемые права
     * @return
     */
    boolean hasAccess(User user, Source source, Rights rights);

    CallScheduleRepository getCallScheduleRepository();

    DayRepository getDayRepository();

    CallPairRepository getCallPairRepository();

    LessonRepository getLessonRepository();

    LessonTemplateRepository getLessonTemplateRepository();

    PlaceRepository getPlaceRepository();

    SourceRepository getSourceRepository();

    TeacherRepository getTeacherRepository();

    UserRepository getUserRepository();

    WeekRepository getWeekRepository();

    AccessTokenRepository getTokenRepository();

    ShareReferenceRepository getReferenceRepository();

    SourcesPriorityRepository getSourcesPriorityRepository();

    TimetableChangesRepository getTimetableChangesRepository();

    WeekDayRepository getWeekDayRepository();

    NoteRepository getNoteRepository();

    AttachmentRepository getAttachmentRepository();
}
