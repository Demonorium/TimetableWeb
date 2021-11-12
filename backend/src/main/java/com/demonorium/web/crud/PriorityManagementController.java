package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
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
import java.util.Optional;

@RestController
public class PriorityManagementController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    /**
     * Обвновить место приоритета в очереди
     * @param sourceId ид источника, для которого обновляем
     * @param newPriority новый приоритет
     * @return
     */
    @GetMapping("/api/update/priority")
    ResponseEntity<String> updatePriority(HttpServletRequest request,
                                          @RequestParam(name= "sourceId") Long sourceId,
                                          @RequestParam(name="priority") Integer newPriority) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = webUtils.getUser(request);

        Optional<SourcesPriority> priority = databaseService.getSourcesPriorityRepository()
                .findByUserAndSource(user, source.get());

        if (!priority.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        priority.get().setPriority(newPriority);
        databaseService.getSourcesPriorityRepository().save(priority.get());

        return ResponseEntity.ok("success");
    }

    /**
     * Добавление источника в список
     * @param sourceId ид источника
     * @param newPriorityNum приоритет с которым он будет добавлен
     */
    @GetMapping("/api/create/priority")
    ResponseEntity<Long> createPriority(HttpServletRequest request,
                                        @RequestParam(name= "sourceId") Long sourceId,
                                        @RequestParam(name="priority") Integer newPriorityNum) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

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

    /**
     * Удаление источника из списка
     * @param sourceId ид источника
     */
    @GetMapping("/api/delete/priority")
    ResponseEntity<String> deletePriority(HttpServletRequest request, @RequestParam(name= "sourceId") Long sourceId) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

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
}
