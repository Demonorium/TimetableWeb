package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.dto.SourcesPriorityDTO;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.SourcesPriority;
import com.demonorium.database.entity.User;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
public class PriorityManagementController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;


    @GetMapping("/api/update/priorities")
    ResponseEntity<List<SourcesPriorityDTO>> updateAllPriorities(HttpServletRequest request,
                                                            @RequestParam(name="sources[]", required = false) List<Long> newPriorities) {
        User user = webUtils.getUser(request);
        for (SourcesPriority priority: user.getPriorities()) {
            databaseService.getSourcesPriorityRepository().delete(priority);
        }

        ArrayList<SourcesPriorityDTO> priorities = new ArrayList<>();

        if (newPriorities != null) {
            int counter = 0;
            Set<Long> priSet = new TreeSet<>();
            Collections.reverse(newPriorities);
            for (Long sourceId : newPriorities) {
                if (priSet.contains(sourceId)) continue;
                priSet.add(sourceId);

                Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

                if (source.isPresent() && databaseService.hasAccess(user, source.get(), Rights.READ)) {
                    SourcesPriority newPriority = new SourcesPriority(user, source.get(), ++counter);
                    priorities.add(new SourcesPriorityDTO(databaseService.getSourcesPriorityRepository().save(newPriority)));
                }
            }
        }
        Collections.reverse(priorities);
        return ResponseEntity.ok(priorities);
    }
}
