package com.demonorium.database;


import com.demonorium.database.entity.AccessToken;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.User;
import com.demonorium.database.repository.*;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Getter
@Service
public class DatabaseServiceImpl implements DatabaseService {
    @Autowired
    private CallScheduleRepository callScheduleRepository;
    @Autowired
    private DayRepository dayRepository;
    @Autowired
    private CallPairRepository callPairRepository;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private LessonTemplateRepository lessonTemplateRepository;
    @Autowired
    private PlaceRepository placeRepository;
    @Autowired
    private SourceRepository sourceRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WeekRepository weekRepository;
    @Autowired
    private AccessTokenRepository tokenRepository;
    @Autowired
    private ShareReferenceRepository referenceRepository;

    @Autowired
    private SourcesPriorityRepository sourcesPriorityRepository;

    @Autowired
    private TimetableChangesRepository timetableChangesRepository;
    @Autowired
    private WeekDayRepository weekDayRepository;

    @Autowired
    private NoteRepository noteRepository;
    @Autowired
    private AttachmentRepository attachmentRepository;

    @Override
    public boolean hasAccess(User user, PartOfSource partOfSource, Rights rights) {
        return hasAccess(user, partOfSource.getSource(), rights);
    }

    @Override
    public boolean hasAccess(User user, Source source, Rights rights) {
        if ((user == null) || (source == null) || (rights == null)) return false;
        if (source.getOwner().equals(user)) return true;

        Optional<AccessToken> access = tokenRepository.findByUserAndReference_Source(user, source);

        return access.filter(accessToken -> Rights.compatible(accessToken.getReference().getRights(), rights)).isPresent();
    }
}
