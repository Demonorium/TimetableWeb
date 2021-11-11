package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.PartOfSource;
import com.demonorium.database.Rights;
import com.demonorium.database.dto.ChangesDto;
import com.demonorium.database.dto.SourceContentDto;
import com.demonorium.database.dto.SourceDto;
import com.demonorium.database.dto.SourcesPriorityDto;
import com.demonorium.database.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.function.Consumer;

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
     */
    @GetMapping("/api/find/current_sources")
    ResponseEntity<List<SourcesPriorityDto>> findSources(HttpServletRequest request) {
        User user = webUtils.getUser(request);
        Set<SourcesPriority> rawPriorities = user.getPriorities();

        ArrayList<SourcesPriorityDto> priorities = new ArrayList<>(rawPriorities.size());
        for (SourcesPriority priority: rawPriorities) {
            priorities.add(SourcesPriorityDto.builder()
                    .withId(priority.getId())
                    .withName(priority.getSource().getName())
                    .withSourceId(priority.getSourceId())
                    .withPriority(priority.getPriority())
                    .build()
            );
        }

        priorities.sort(Collections.reverseOrder());

        return ResponseEntity.ok(priorities);
    }

    @GetMapping("/api/find/changes")
    ResponseEntity<ChangesDto> findChanges(HttpServletRequest request,
                                           @RequestParam(name="sourceId") Long sourceId,
                                           @RequestParam(name="year")   Integer year,
                                           @RequestParam(name="day")    Integer day) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);
        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, source.get(), Rights.READ)) {
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

            return ResponseEntity.ok(ChangesDto.builder()
                .withId(changes.get().getId())
                .withDay(day).withYear(year)
                .withSchedule(callPairs)
                .withLessons(lessons)
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
    @GetMapping("/api/delete/call")
    ResponseEntity<String> deleteCall(HttpServletRequest request, @RequestParam(name="id") Long id) {
        Optional<CallPair> callPair = databaseService.getCallPairRepository().findById(id);

        if (!callPair.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, callPair, Rights.UPDATE)) {
            databaseService.getCallPairRepository().delete(callPair.get());

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
    ResponseEntity<String> deleteSchedule(HttpServletRequest request, @RequestParam(name="id") Long id) {
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




    @GetMapping("/api/update/priority")
    ResponseEntity<String> updatePriority(HttpServletRequest request,
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
                                        @RequestParam(name="priority") Integer newPriorityNum) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = webUtils.getUser(request);

        if (databaseService.hasAccess(user, source.get(), Rights.READ)) {
            Optional<SourcesPriority> priority = databaseService.getSourcesPriorityRepository()
                    .findByUserAndSource(user, source.get());
            if (priority.isPresent()) {
                return ResponseEntity.unprocessableEntity().build();
            }

            SourcesPriority newPriority = new SourcesPriority(user, source.get(), newPriorityNum);

            return ResponseEntity.ok(databaseService.getSourcesPriorityRepository().save(newPriority).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }
    @GetMapping("/api/delete/priority")
    ResponseEntity<String> deletePriority(HttpServletRequest request, @RequestParam(name="sourceId") Long id) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = webUtils.getUser(request);

        Optional<SourcesPriority> priority = databaseService.getSourcesPriorityRepository()
                .findByUserAndSource(user, source.get());

        if (!priority.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        databaseService.getSourcesPriorityRepository().delete(priority.get());

        return ResponseEntity.ok("success");
    }

    @GetMapping("/api/part-find/source/defaultSchedule")
    ResponseEntity<CallSchedule> partFindSourceDefaultSchedule(HttpServletRequest request, @RequestParam(name="sourceId") Long id) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, source.get(), Rights.READ)) {
            return ResponseEntity.ok(source.get().getDefaultSchedule());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/part-update/source/defaultSchedule")
    ResponseEntity<String> partUpdateSourceDefaultSchedule(HttpServletRequest request,
                                                @RequestParam(name="sourceId") Long sourceId,
                                                @RequestParam(name="scheduleId") Long scheduleId) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Optional<CallSchedule> schedule = databaseService.getCallScheduleRepository().findById(scheduleId);
        if (!schedule.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, source.get(), Rights.UPDATE) && hasAccess(request, schedule, Rights.READ)) {
            source.get().setDefaultSchedule(schedule.get());
            databaseService.getSourceRepository().save(source.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/part-update/source/basic-info")
    ResponseEntity<String> partUpdateSourceBasicInfo(HttpServletRequest request,
                                          @RequestParam(name="id") Long id,
                                          @RequestParam(name="name") String name,
                                            @RequestParam(name="startDate") Long startDate,
                                            @RequestParam(name="startWeek") Integer startWeek,
                                            @RequestParam(name="endDate", required = false) Long endDate){
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, source.get(), Rights.UPDATE)) {
            Source sourceSrk = source.get();
            sourceSrk.setName(name);
            sourceSrk.setStartWeek(startWeek);
            sourceSrk.setStartDate(new Date(startDate));
            sourceSrk.setEndDate(endDate == null ? null : new Date(endDate));

            databaseService.getSourceRepository().save(sourceSrk);
            return ResponseEntity.ok("success");
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/create/source")
    ResponseEntity<Long> createSource(HttpServletRequest request,
                                                    @RequestParam(name="name") String name,
                                                    @RequestParam(name="startDate") Long startDate,
                                                    @RequestParam(name="startWeek") Integer startWeek,
                                                    @RequestParam(name="endDate", required = false) Long endDate){
        Source source = new Source(name, new Date(startDate), startWeek, webUtils.getUser(request));
        source.setEndDate(endDate == null ? null : new Date(endDate));

        return ResponseEntity.ok(databaseService.getSourceRepository().save(source).getId());
    }

    @GetMapping("api/find/source")
    ResponseEntity<SourceContentDto> findSource(HttpServletRequest request, @RequestParam(name="id") Long id) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);
        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (hasAccess(request, source.get(), Rights.READ)) {
            return ResponseEntity.ok(new SourceContentDto(source.get()));
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/all_sources")
    ResponseEntity<List<SourceDto>> findAll(HttpServletRequest request) {
        User user = webUtils.getUser(request);

        List<Source> sources = user.getSources();

        List<SourceDto> result = new ArrayList<>(sources.size());
        sources.forEach(source -> result.add(new SourceDto(source)));

        Set<AccessToken> tokens = user.getTokens();
        tokens.forEach(accessToken -> result.add(new SourceDto(accessToken.getReference().getSource())));

        return ResponseEntity.ok(result);
    }
}
