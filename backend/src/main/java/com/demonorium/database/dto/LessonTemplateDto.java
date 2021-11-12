package com.demonorium.database.dto;

import com.demonorium.database.entity.LessonTemplate;
import com.demonorium.database.entity.Teacher;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class LessonTemplateDto {
    /**
     * ИД объекта в базе
     */
    private Long id;
    /**
     * Название предмета
     */
    private String name;
    /**
     * Коротка заметка
     */
    private String note;
    /**
     * Список преподавателей
     */
    private Set<Long> defaultTeachers;

    /**
     * Количество часов отведённых на предмет
     */
    private int hours;

    public LessonTemplateDto(LessonTemplate template) {
        this.id = template.getId();
        this.name = template.getName();
        this.note = template.getNote();
        this.defaultTeachers = new HashSet<>();
        template.getDefaultTeachers().forEach(teacher -> defaultTeachers.add(teacher.getId()));
    }
}
