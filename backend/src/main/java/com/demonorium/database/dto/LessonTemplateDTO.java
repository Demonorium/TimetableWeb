package com.demonorium.database.dto;

import com.demonorium.database.entity.LessonTemplate;
import com.demonorium.database.entity.Teacher;
import lombok.Data;
import lombok.NonNull;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class LessonTemplateDTO {
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
    private List<Long> defaultTeachers;

    /**
     * Количество часов отведённых на предмет
     */
    private int hours;

    public LessonTemplateDTO(@NonNull LessonTemplate template) {
        this.id = template.getId();
        this.name = template.getName();
        this.note = template.getNote();
        this.defaultTeachers = template.getDefaultTeachers().stream()
                .map(Teacher::getId)
                .collect(Collectors.toList());
    }
}
