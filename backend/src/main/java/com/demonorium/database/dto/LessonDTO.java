package com.demonorium.database.dto;

import com.demonorium.database.entity.Lesson;
import com.demonorium.database.entity.Teacher;
import lombok.Data;
import lombok.NonNull;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class LessonDTO implements Comparable<LessonDTO> {
    /**
     * ИД объекта в базе
     */
    private Long id;

    /**
     * Описание данного занятия (класс описывающий вид занятия)
     */
    private Long template;

    /**
     * Место проведения занятия
     */
    private Long place;

    /**
     * Номер занятия в дне
     */
    private int number;

    /**
     * Список всех учителей проводящих занятие, перекрывает список из template
     */
    private List<Long> teachers;

    public LessonDTO(@NonNull Lesson lesson) {
        this.id = lesson.getId();
        this.template = lesson.getTemplate().getId();
        this.place = lesson.getPlace().getId();
        this.number = lesson.getNumber();
        this.teachers = lesson.getTeachers().stream()
                .map(Teacher::getId)
                .collect(Collectors.toList());
    }

    @Override
    public int compareTo(LessonDTO o) {
        return number - o.number;
    }
}
