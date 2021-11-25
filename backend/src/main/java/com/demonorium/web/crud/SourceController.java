package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.dto.SourceDTO;
import com.demonorium.database.dto.SourcesPriorityDTO;
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
public class SourceController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    /**
     * Запрос всех источников в порядке их приоритета
     */
    @GetMapping("/api/find/current_sources")
    ResponseEntity<List<SourcesPriorityDTO>> findSources(HttpServletRequest request) {
        User user = webUtils.getUser(request);
        Set<SourcesPriority> rawPriorities = user.getPriorities();

        ArrayList<SourcesPriorityDTO> priorities = new ArrayList<>(rawPriorities.size());
        for (SourcesPriority priority: rawPriorities) {
            priorities.add(SourcesPriorityDTO.builder()
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


    /**
     * Обновление информации об источнике
     * @param id ид источника
     * @param name название
     * @param startDate дата начала занятий
     * @param startWeek номер недели с которое начинаются занятия
     * @param endDate конец занятий
     */
    @GetMapping("/api/part-update/source/basic-info")
    ResponseEntity<String> partUpdateSourceBasicInfo(HttpServletRequest request,
                                                     @RequestParam(name="id") Long id,
                                                     @RequestParam(name="name") String name,
                                                     @RequestParam(name="startDate") Long startDate,
                                                     @RequestParam(name="startWeek") Integer startWeek,
                                                     @RequestParam(name="endDate", required = false) Long endDate,
                                                     @RequestParam(name="defaultSchedule", required = false) List<Integer> schedule){
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }


        if (webUtils.hasAccess(request, source.get(), Rights.UPDATE)) {
            source.get().setName(name);
            source.get().setStartWeek(startWeek);
            source.get().setStartDate(new Date(startDate));
            source.get().setEndDate(endDate == null ? null : new Date(endDate));

            databaseService.getSourceRepository().save(source.get());

            CallSchedule sc = source.get().getDefaultSchedule();

            if ((sc == null) && (schedule != null) && !schedule.isEmpty()) {
                sc = new CallSchedule();
                sc.setSource(source.get());
                sc = databaseService.getCallScheduleRepository().save(sc);

                source.get().setDefaultSchedule(sc);
                databaseService.getSourceRepository().save(source.get());
                sc = databaseService.getCallScheduleRepository().findById(sc.getId()).get();
            }

            if (sc != null) {
                for (CallPair pair: sc.getSchedule())
                    databaseService.getCallPairRepository().delete(pair);
                if (schedule != null) {
                    for (Integer time : schedule) {
                        CallPair pair = new CallPair();
                        pair.setSchedule(sc);
                        pair.setTime((short) (int) time);
                        databaseService.getCallPairRepository().save(pair);
                    }
                }
            }

            return ResponseEntity.ok("success");
        }
        return ResponseEntity.unprocessableEntity().build();
    }

    /**
     * Создание нового источника
     * @param name название
     * @param startDate дата начала занятий
     * @param startWeek номер недели с которое начинаются занятия
     * @param endDate конец занятий
     */
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

    /**
     * Удалить источник
     * @param id ид источника
     */
    @GetMapping("api/delete/source")
    ResponseEntity<String> deleteSource(HttpServletRequest request, @RequestParam(name="id") Long id) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.DELETE)) {
            databaseService.getSourceRepository().delete(source.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/find/all_sources")
    ResponseEntity<List<SourceDTO>> findAllSources(HttpServletRequest request) {
        User user = webUtils.getUser(request);

        List<Source> sources = user.getSources();

        List<SourceDTO> result = new ArrayList<>(sources.size());
        sources.forEach(source -> result.add(new SourceDTO(source, user)));

        Set<AccessToken> tokens = user.getTokens();
        tokens.forEach(accessToken -> result.add(new SourceDTO(accessToken.getReference().getSource(), user)));

        return ResponseEntity.ok(result);
    }
}
