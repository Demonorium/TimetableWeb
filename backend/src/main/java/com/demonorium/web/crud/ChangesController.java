package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.dto.ChangesDTO;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.SourcesPriority;
import com.demonorium.database.entity.TimetableChanges;
import com.demonorium.database.entity.User;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.function.Consumer;

@RestController
public class ChangesController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/find/changes")
    ResponseEntity<Map<Long, ArrayList<ChangesDTO>>> findChanges(HttpServletRequest request,
                                           @RequestParam(name="startDate")   Long startDate,
                                           @RequestParam(name="endDate")     Long endDate) {
        User user = webUtils.getUser(request);
        ArrayList<SourcesPriority> priorities = new ArrayList<>(user.getPriorities());
        priorities.sort(Collections.reverseOrder());

        Map<Long, ArrayList<ChangesDTO>> map = new TreeMap<>();

        for (SourcesPriority priority: priorities) {
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
}
