package com.demonorium.database.dto;

import com.demonorium.database.entity.Place;
import com.demonorium.database.entity.Source;
import com.demonorium.database.entity.Teacher;
import com.demonorium.database.entity.Week;
import lombok.Data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Data
public class SourceContentDTO {
    /**
     * Общая информация об источнике
     */
    private SourceDTO source;
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

    public SourceContentDTO(Source source) {
        this.source = new SourceDTO(source);
        this.weeks = new ArrayList<>(source.getWeeks());
        Collections.sort(this.weeks);

        this.places = source.getPlaces();
        this.teachers = source.getTeachers();
        this.templates = new HashSet<>();
        source.getTemplates().forEach(template -> this.templates.add(new LessonTemplateDTO(template)));
    }
}
