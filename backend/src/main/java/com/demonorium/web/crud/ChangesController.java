package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.dto.ChangesDTO;
import com.demonorium.database.entity.*;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
public class ChangesController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/find/changes")
    ResponseEntity<Map<Long, ArrayList<ChangesDTO>>> findChanges(HttpServletRequest request,
                                                                 @RequestParam(name = "startDate") Long startDate,
                                                                 @RequestParam(name = "endDate") Long endDate) {
        User user = webUtils.getUser(request);
        ArrayList<SourcesPriority> priorities = new ArrayList<>(user.getPriorities());
        priorities.sort(Collections.reverseOrder());

        Map<Long, ArrayList<ChangesDTO>> map = new TreeMap<>();

        for (SourcesPriority priority : priorities) {
            if (webUtils.hasAccess(request, priority.getSource(), Rights.READ)) {
                Collection<TimetableChanges> changes = databaseService.getTimetableChangesRepository()
                        .getChanges(priority.getSource().getId(), new Date(startDate), new Date(endDate));

                changes.forEach(timetableChanges -> {
                    if (!map.containsKey(timetableChanges.getDate().getTime())) {
                        map.put(timetableChanges.getDate().getTime(), new ArrayList<>());
                    }
                    map.get(timetableChanges.getDate().getTime()).add(new ChangesDTO(timetableChanges, priority.getPriority()));
                });
            }
        }
        return ResponseEntity.ok(map);
    }

    @GetMapping("/api/create/changes")
    ResponseEntity<ChangesDTO> createChanges(HttpServletRequest request,
                                             @RequestParam(name = "sourceId") Long sourceId,
                                             @RequestParam(name = "date") Long date) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.UPDATE)) {
            if (databaseService.getTimetableChangesRepository().existsBySourceAndDate(source.get(), new Date(date))) {
                return ResponseEntity.unprocessableEntity().build();
            }


            Day day = new Day(source.get());
            day = databaseService.getDayRepository().save(day);

            TimetableChanges changes = new TimetableChanges(source.get(), new Date(date), day);
            changes = databaseService.getTimetableChangesRepository().save(changes);

            return ResponseEntity.ok(new ChangesDTO(changes, -1));
        }


        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/delete/changes")
    ResponseEntity<String> deleteChanges(HttpServletRequest request,
                                             @RequestParam(name = "sourceId") Long sourceId,
                                             @RequestParam(name = "date") Long date) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.DELETE)) {
            Optional<TimetableChanges> changes = databaseService.getTimetableChangesRepository().findBySourceAndDate(source.get(), new Date(date));

            if (!changes.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            databaseService.getTimetableChangesRepository().delete(changes.get());
            databaseService.getDayRepository().delete(changes.get().getDay());
            return ResponseEntity.ok("success");
        }
        return ResponseEntity.unprocessableEntity().build();
    }
}