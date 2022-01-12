package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.Day;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.Week;
import com.demonorium.database.entity.WeekDay;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
public class WeekController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/create/week")
    ResponseEntity<Long> createWeek(HttpServletRequest request,
                                       @RequestParam(name="sourceId") Long id,
                                       @RequestParam(name="number") Integer number) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.UPDATE)) {
            Week week = new Week(number, source.get());

            return ResponseEntity.ok(databaseService.getWeekRepository().save(week).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/delete/week")
    ResponseEntity<String> deleteWeek(HttpServletRequest request,
                                         @RequestParam(name="id") Long id) {

        Optional<Week> week = databaseService.getWeekRepository().findById(id);

        if (!week.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, week, Rights.DELETE)) {
            databaseService.getWeekRepository().delete(week.get());
            databaseService.getWeekRepository().updateAfterRemove(week.get().getSourceId(), week.get().getNumber());
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/delete/weekDay")
    ResponseEntity<String> deleteWeekDay(HttpServletRequest request,
                                      @RequestParam(name="id") Long id) {
        Optional<WeekDay> weekDay = databaseService.getWeekDayRepository().findById(id);

        if (!weekDay.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, weekDay, Rights.DELETE)) {
            databaseService.getDayRepository().delete(weekDay.get().getDay());
            databaseService.getWeekDayRepository().delete(weekDay.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/create/weekDay")
    ResponseEntity<WeekDay> createWeekDay(HttpServletRequest request,
                                          @RequestParam(name="weekId") Long weekId,
                                          @RequestParam(name="number") Integer number) {
        Optional<Week> week = databaseService.getWeekRepository().findById(weekId);

        if (!week.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, week, Rights.UPDATE)) {
            if (databaseService.getWeekDayRepository().existsByWeekAndNumber(week.get(), number)) {
                return ResponseEntity.unprocessableEntity().build();
            }

            Day day = new Day(week.get().getSource());
            day = databaseService.getDayRepository().save(day);

            WeekDay weekDay = new WeekDay(number, day, week.get());
            return ResponseEntity.ok(databaseService.getWeekDayRepository().save(weekDay));
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}
