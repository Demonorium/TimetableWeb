package com.demonorium.web.crud;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.Note;
import com.demonorium.database.entity.Source;
import com.demonorium.database.repository.NoteRepository;
import com.demonorium.web.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class NoteController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/api/create/note")
    ResponseEntity<Long> createNote(HttpServletRequest request,
                                    @RequestParam(name="sourceId") Long id,
                                    @RequestParam(name="date") Long targetDate,
                                    @RequestParam(name="text") String text,
                                    @RequestParam(name="attachments[]", required = false) List<String> attachments) {
        Optional<Source> source = databaseService.getSourceRepository().findById(id);

        if (!source.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, source.get(), Rights.UPDATE)) {
            Note note = new Note(new Date(targetDate), text, source.get());
            return ResponseEntity.ok(databaseService.getNoteRepository().save(note).getId());
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/update/note")
    ResponseEntity<String> updateNote(HttpServletRequest request,
                                      @RequestParam(name="id") Long id,
                                      @RequestParam(name="date") Long targetDate,
                                      @RequestParam(name="text") String text,
                                      @RequestParam(name="attachments[]", required = false) List<String> attachments) {
        Optional<Note> note = databaseService.getNoteRepository().findById(id);

        if (!note.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, note, Rights.UPDATE)) {
            note.get().setDate(new Date(targetDate));
            note.get().setText(text);
            databaseService.getNoteRepository().save(note.get());
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }

    @GetMapping("/api/delete/note")
    ResponseEntity<String> updateNote(HttpServletRequest request, @RequestParam(name="id") Long id) {
        Optional<Note> note = databaseService.getNoteRepository().findById(id);

        if (!note.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        if (webUtils.hasAccess(request, note, Rights.DELETE)) {
            databaseService.getNoteRepository().delete(note.get());
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.unprocessableEntity().build();
    }
}
