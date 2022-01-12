package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.Place;
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
public class PlaceController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/create/place")
    ResponseEntity<Long> createPlace(HttpServletRequest request,
                                     @RequestParam(name="sourceId") Long id,
                                     @RequestParam(name="note", required = false) String note,
                                     @RequestParam(name="auditory") String auditory,
                                     @RequestParam(name="building") String building) {

        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.UPDATE)) {
            Place place = new Place(auditory, building, note, source.get());

            return ResponseEntity.ok(databaseService.getPlaceRepository().save(place).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/update/place")
    ResponseEntity<String> updatePlace(HttpServletRequest request,
                                       @RequestParam(name="id") Long id,
                                       @RequestParam(name="note", required = false) String note,
                                       @RequestParam(name="auditory") String auditory,
                                       @RequestParam(name="building") String building) {

        Optional<Place> place = databaseService.getPlaceRepository().findById(id);

        if (!place.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, place, Rights.UPDATE)) {
            Place current = place.get();

            current.setAuditory(auditory);
            current.setBuilding(building);
            current.setNote(note);

            databaseService.getPlaceRepository().save(current);

            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/delete/place")
    ResponseEntity<String> deletePlace(HttpServletRequest request,
                                       @RequestParam(name="id") Long id) {

        Optional<Place> place = databaseService.getPlaceRepository().findById(id);

        if (!place.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, place, Rights.DELETE)) {
            databaseService.getPlaceRepository().delete(place.get());
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}
