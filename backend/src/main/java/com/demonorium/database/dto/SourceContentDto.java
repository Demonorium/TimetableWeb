package com.demonorium.database.dto;

import com.demonorium.database.entity.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Set;

@Data
public class SourceContentDto {
    /**
     * Общая информация об источнике
     */
    private SourceDto source;
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
    private Set<LessonTemplate> templates;

    public SourceContentDto(Source source) {
        this.source = new SourceDto(source);
        this.weeks = new ArrayList<>(source.getWeeks());
        Collections.sort(this.weeks);

        this.places = source.getPlaces();
        this.teachers = source.getTeachers();
        this.templates = source.getTemplates();
    }
}
