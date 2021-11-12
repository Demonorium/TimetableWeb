package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.CallPair;
import com.demonorium.database.entity.CallSchedule;
import com.demonorium.database.entity.Source;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
public class CallScheduleController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/create/call")
    ResponseEntity<Long> createCall(HttpServletRequest request,
                                    @RequestParam(name="scheduleId") Long id,
                                    @RequestParam(name="hour") Byte hour,
                                    @RequestParam(name="minute") Byte minute) {
        Optional<CallSchedule> schedule = databaseService.getCallScheduleRepository().findById(id);

        if (!schedule.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, schedule, Rights.UPDATE)) {
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

        if (webUtils.hasAccess(request, callPair, Rights.UPDATE)) {
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

        if (webUtils.hasAccess(request, callPair, Rights.UPDATE)) {
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

        if (webUtils.hasAccess(request, source.get(), Rights.UPDATE)) {
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

        if (webUtils.hasAccess(request, schedule, Rights.UPDATE)) {
            databaseService.getCallScheduleRepository().delete(schedule.get());

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}
