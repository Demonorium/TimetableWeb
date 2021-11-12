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
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
public class ChangesController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;



    @GetMapping("/api/find/changes")
    ResponseEntity<ChangesDTO> findChanges(HttpServletRequest request,
                                           @RequestParam(name="sourceId") Long sourceId,
                                           @RequestParam(name="year")   Integer year,
                                           @RequestParam(name="day")    Integer day) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);
        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.READ)) {
            Optional<TimetableChanges> changes = databaseService.getTimetableChangesRepository()
                    .findBySourceAndDate_YearAndDate_DayIs(source.get(), year, day);

            if (!changes.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Day changesOnDay = changes.get().getDay();

            List<CallPair> callPairs;
            if (changesOnDay.getSchedule() != null) {
                callPairs = new ArrayList<>(changesOnDay.getSchedule().getSchedule());
                Collections.sort(callPairs);
            } else {
                callPairs = new ArrayList<>();
            }
            Collections.sort(callPairs);

            List<Lesson> lessons = new ArrayList<>(changesOnDay.getLessons());
            Collections.sort(lessons);

            return ResponseEntity.ok(ChangesDTO.builder()
                .withId(changes.get().getId())
                .withDay(day).withYear(year)
                .withSchedule(callPairs)
                .withLessons(lessons)
                    .build());
        }

        return ResponseEntity.unprocessableEntity().build();
    }










}
