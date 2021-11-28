package com.demonorium.database.dto;

import com.demonorium.database.Rights;
import com.demonorium.database.entity.*;
import lombok.Data;

import java.util.*;

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
    private ArrayList<CallPair> defaultSchedule;

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
    private ArrayList<Week> weeks;
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
    private ArrayList<Note> notes;

    @Data
    private static class ChangesInfo {
        private Long date;
        private Long day;

        public ChangesInfo(Long time, Long id) {
            this.date = time;
            this.day = id;
        }
    }

    /**
     * Изменения
     */
    private ArrayList<ChangesInfo> changes;



    /**
     * Права доступа
     */
    private Rights rights;



    public SourceDTO(Source source, User user) {
        this.id = source.getId();
        this.name = source.getName();
        this.owner = source.getOwnerName();

        this.startDate = source.getStartDate().getTime();
        this.endDate = source.getEndDate() == null ? null : source.getEndDate().getTime();
        this.startWeek = source.getStartWeek();

        if (source.getDefaultSchedule() != null) {
            defaultSchedule = new ArrayList<>(source.getDefaultSchedule().getSchedule());
            Collections.sort(defaultSchedule);
        }

        this.weeks = new ArrayList<>(source.getWeeks());
        Collections.sort(this.weeks);

        this.places = source.getPlaces();
        this.teachers = source.getTeachers();
        this.templates = new HashSet<>();
        source.getTemplates().forEach(template -> this.templates.add(new LessonTemplateDTO(template)));
        this.days = new HashSet<>();
        source.getDays().forEach(day -> days.add(new DayDTO(day)));
        if (user.equals(source.getOwner())) {
            rights = Rights.OWNER;
        } else if (source.getReference() != null) {
            rights = source.getReference().getRights();
        }

        this.notes = new ArrayList<>(source.getNotes());
        Collections.sort(this.notes);

        this.changes = new ArrayList<>();
        source.getChanges().forEach(changes ->
                this.changes.add(new ChangesInfo(changes.getDate().getTime(), changes.getDay().getId())));
        changes.sort(Comparator.comparing(ChangesInfo::getDate));
    }
}
