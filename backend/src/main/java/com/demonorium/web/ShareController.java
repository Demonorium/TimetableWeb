package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.AccessToken;
import com.demonorium.database.entity.ShareReference;
import com.demonorium.database.entity.Source;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.Optional;

@RestController
public class ShareController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    private Rights parseRights(String rights) {
        switch (rights) {
            case "READ_UPDATE":
                return Rights.READ_UPDATE;
            case "OWNER":
                return Rights.OWNER;
            default:
                return Rights.READ;
        }
    }

    @GetMapping("/api/change_rights")
    ResponseEntity<String> changeRights(HttpServletRequest request,
                                 @RequestParam("id")Long sourceId,
                                 @RequestParam("rights")String rights) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (source.get().getOwner() == webUtils.getUser(request)) {
            ShareReference reference = source.get().getReference();
            if (reference == null) {
                return ResponseEntity.notFound().build();
            }

            reference.setRights(parseRights(rights));

            databaseService.getReferenceRepository().save(reference);

            return ResponseEntity.ok(reference.getCode());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/close_ref")
    ResponseEntity<String> closeRef(HttpServletRequest request, @RequestParam("id")Long sourceId) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (source.get().getOwner() == webUtils.getUser(request)) {
            ShareReference reference = source.get().getReference();
            if (reference == null) {
                return ResponseEntity.notFound().build();
            }

            databaseService.getReferenceRepository().delete(reference);

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/share")
    ResponseEntity<String> share(HttpServletRequest request,
                                 @RequestParam("id")Long sourceId,
                                 @RequestParam("rights")String rights) {
        Optional<Source> source = databaseService.getSourceRepository().findById(sourceId);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (source.get().getOwner() == webUtils.getUser(request)) {
            ShareReference reference = new ShareReference();

            reference.setSource(source.get());
            reference.setRights(parseRights(rights));
            reference.setCode(Long.toHexString(sourceId) + "_" + Long.toHexString(new Date().getTime() * source.hashCode()));

            source.get().setReference(databaseService.getReferenceRepository().save(reference));
            databaseService.getSourceRepository().save(source.get());
            return ResponseEntity.ok(reference.getCode());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/ref/{ref}")
    ResponseEntity<Long> getAccess(HttpServletRequest request,
                                 @PathVariable("ref") String code) {
        Optional<ShareReference> reference = databaseService.getReferenceRepository().findById(code);

        if (reference.isPresent()) {
            if (databaseService.getTokenRepository().existsByUserAndReference_Source(webUtils.getUser(request), reference.get().getSource())) {
                return ResponseEntity.ok(reference.get().getSourceId());
            }

            AccessToken token = new AccessToken();
            token.setReference(reference.get());
            token.setUser(webUtils.getUser(request));

            databaseService.getTokenRepository().save(token);

            return ResponseEntity.ok(reference.get().getSourceId());
        }

        return ResponseEntity.notFound().build();
    }
}
