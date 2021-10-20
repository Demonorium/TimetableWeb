package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.PartOfSource;
import com.demonorium.database.Rights;
import com.demonorium.database.dto.ChangesDto;
import com.demonorium.database.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
public class CrudApiController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    private <T extends PartOfSource> boolean hasAccess(HttpServletRequest request, Optional<T> partOfSource, Rights rights) {
        return databaseService.hasAccess(webUtils.getUser(request), partOfSource.get(), rights);
    }
    private boolean hasAccess(HttpServletRequest request, PartOfSource partOfSource, Rights rights) {
        return databaseService.hasAccess(webUtils.getUser(request), partOfSource, rights);
    }
    private boolean hasAccess(HttpServletRequest request, Source source, Rights rights) {
        return databaseService.hasAccess(webUtils.getUser(request), source, rights);
    }

    /**
     * Запрос всех источников в порядке их приоритета
     * @param request
     * @return
     */
    @GetMapping("/api/find/current_sources")
    ResponseEntity<List<SourcesPriority>> findSources(HttpServletRequest request) {
        User user = webUtils.getUser(request);

        ArrayList<SourcesPriority> priorities = new ArrayList<>(user.getPriorities());
        Collections.sort(priorities);

        return ResponseEntity.ok(priorities);
    }

    @GetMapping("/api/find/changes")
    ResponseEntity<ChangesDto> findChanges(HttpServletRequest request,
                                           @RequestParam(name="sourceId") Long sourceId,
                                           @RequestParam(name="year")   Integer year,
                                           @RequestParam(name="day")    Integer day) {
        Optional<TimetableChanges> changes = databaseService.getTimetableChangesRepository()
                .findBySourceAndDate_YearAndDayIs(sourceId, year, day);

        if (!changes.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, changes, Rights.READ)) {
            Day changesOnDay = changes.get().getDay();

            List<CallPair> callPairs;
            if (changesOnDay.getSchedule() != null) {
                callPairs = changesOnDay.getSchedule().getSchedule();
                Collections.sort(callPairs);
            } else {
                callPairs = new ArrayList<>();
            }
            List<Lesson> lessons = new ArrayList<>(changesOnDay.getLessons());

            Collections.sort(callPairs);
            Collections.sort(lessons);

            return ResponseEntity.ok(ChangesDto.builder()
                .id(changes.get().getId())
                .day(day).year(year)

                .schedule(callPairs)
                .lessons(lessons)
                    .build());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/create/call")
    ResponseEntity<Long> createCall(HttpServletRequest request,
                                      @RequestParam(name="scheduleId") Long id,
                                      @RequestParam(name="hour") Byte hour,
                                      @RequestParam(name="minute") Byte minute) {
        Optional<CallSchedule> schedule = databaseService.getCallScheduleRepository().findById(id);

        if (!schedule.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, schedule, Rights.UPDATE)) {
            CallPair callPair = new CallPair(schedule.get(), hour, minute);

            return ResponseEntity.ok(databaseService.getCallPairRepository().save(callPair).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/update/call")
    ResponseEntity<String> updateCall(HttpServletRequest request,
                                      @RequestParam(name="id") Long id,
                                      @RequestParam(name="hour") Byte hour,
                                      @RequestParam(name="minute") Byte minute) {
        Optional<CallPair> callPair = databaseService.getCallPairRepository().findById(id);

        if (!callPair.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, callPair, Rights.UPDATE)) {
            callPair.get().setHour(hour);
            callPair.get().setMinute(minute);

            databaseService.getCallPairRepository().save(callPair.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/create/schedule")
    ResponseEntity<Long> createSchedule(HttpServletRequest request, @RequestParam("sourceId") Long id) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, source.get(), Rights.UPDATE)) {
            CallSchedule schedule = new CallSchedule(source.get());

            return ResponseEntity.ok(databaseService.getCallScheduleRepository().save(schedule).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/delete/schedule")
    ResponseEntity<String> updateSchedule(HttpServletRequest request, @RequestParam(name="id") Long id) {
        Optional<CallSchedule> schedule = databaseService.getCallScheduleRepository().findById(id);

        if (!schedule.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, schedule, Rights.UPDATE)) {
            databaseService.getCallScheduleRepository().delete(schedule.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }


    @GetMapping("/api/find/all_sources")
    ResponseEntity<List<Long>> findAll(HttpServletRequest request) {
        User user = webUtils.getUser(request);

        List<Source> sources = user.getSources();

        List<Long> result = new ArrayList<>(sources.size());
        sources.forEach(source -> result.add(source.getId()));

        Set<AccessToken> tokens = user.getTokens();
        tokens.forEach((accessToken -> result.add(accessToken.getReference().getSource().getId())));

        return ResponseEntity.ok(result);
    }


    @GetMapping("/api/update/priority")
    ResponseEntity<String> findPriority(HttpServletRequest request,
                                                 @RequestParam(name="sourceId") Long id,
                                                 @RequestParam(name="priority") Integer newPriority) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = webUtils.getUser(request);

        if (databaseService.hasAccess(user, source.get(), Rights.READ)) {
            Optional<SourcesPriority> priority = databaseService.getSourcesPriorityRepository()
                    .findByUserAndSource(user, source.get());
            if (!priority.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            priority.get().setPriority(newPriority);
            databaseService.getSourcesPriorityRepository().save(priority.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/create/priority")
    ResponseEntity<Long> createPriority(HttpServletRequest request,
                                        @RequestParam(name="sourceId") Long id,
                                        @RequestParam(name="priority") Integer newPriority) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = webUtils.getUser(request);

        if (databaseService.hasAccess(user, source.get(), Rights.READ)) {
            SourcesPriority priority = new SourcesPriority(user, source.get(), newPriority);

            return ResponseEntity.ok(databaseService.getSourcesPriorityRepository().save(priority).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}
