package com.demonorium.database.dto;

import com.demonorium.database.Rights;
import com.demonorium.database.entity.*;
import lombok.Data;
import lombok.NonNull;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class SourceDTO {
    /**
     * Ид источника
     */
    private Long id;
    /**
     * Имя источника
     */
    private String name;
    /**
     * Владелец источника
     */
    private String owner;

    /**
     * Стандартное расписание
     */
    private List<CallPair> defaultSchedule;

    /**
     * Дата начала занятий
     */
    private Long startDate;

    /**
     * Первая неделя
     */
    private int startWeek;

    /**
     * Дата окончания занятий
     */
    private Long endDate;

    /**
     * Недели (отсорированы по номеру)
     */
    private List<Week> weeks;
    /**
     * Места проведения занятий
     */
    private Set<Place> places;
    /**
     * Учителя
     */
    private Set<Teacher> teachers;
    /**
     * Занятия
     */
    private Set<LessonTemplateDTO> templates;

    /**
     * Дни
     */
    private Set<DayDTO> days;

    /**
     * Задания
     */
    private List<Note> notes;

    @Data
    private static class ChangesInfo {
        private Long date;
        private Long day;

        public ChangesInfo(@NonNull TimetableChanges changes) {
            this.date = changes.getDate().getTime();
            this.day = changes.getDay().getId();
        }
    }

    /**
     * Изменения
     */
    private List<ChangesInfo> changes;

    /**
     * Права доступа
     */
    private Rights rights;

    /**
     * Код доступа
     */
    private String code;

    /**
     * Предоставляемые ссылкой права
     */
    private Rights refRights;

    public SourceDTO(@NonNull Source source, @NonNull User user) {
        this.id = source.getId();
        this.name = source.getName();
        this.owner = source.getOwnerName();

        this.startDate = source.getStartDate().getTime();
        this.endDate = source.getEndDate() == null ? null : source.getEndDate().getTime();

        this.startWeek = source.getStartWeek();

        if (source.getReference() != null) {
            this.code = source.getReference().getCode();
            this.refRights  = source.getReference().getRights();
        } else {
            this.code = null;
            this.refRights = null;
        }

        if (source.getDefaultSchedule() != null) {
            defaultSchedule = source.getDefaultSchedule().getSchedule().stream()
                    .sorted()
                    .collect(Collectors.toList());
        }

        this.weeks = source.getWeeks().stream()
                .sorted()
                .collect(Collectors.toList());

        this.places = source.getPlaces();
        this.teachers = source.getTeachers();

        this.templates = source.getTemplates().stream()
                .map(LessonTemplateDTO::new)
                .collect(Collectors.toSet());

        this.days = source.getDays().stream()
                .map(DayDTO::new)
                .collect(Collectors.toSet());

        if (user.equals(source.getOwner())) {
            rights = Rights.OWNER;
        } else if (source.getReference() != null) {
            rights = source.getReference().getRights();
        }

        this.notes = source.getNotes().stream()
                .sorted()
                .collect(Collectors.toList());

        this.changes = source.getChanges().stream()
                .map(ChangesInfo::new)
                .sorted(Comparator.comparing(ChangesInfo::getDate))
                .collect(Collectors.toList());
    }
}
