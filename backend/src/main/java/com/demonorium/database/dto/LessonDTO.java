package com.demonorium.database.dto;

import com.demonorium.database.entity.Lesson;
import lombok.Data;

import java.util.ArrayList;

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
    private ArrayList<Long> teachers;

    public LessonDTO(Lesson lesson) {
        this.id = lesson.getId();
        this.template = lesson.getTemplate().getId();
        this.place = lesson.getPlace().getId();
        this.number = lesson.getNumber();
        this.teachers = new ArrayList<>();
        lesson.getTeachers().forEach(teacher -> teachers.add(teacher.getId()));
    }

    @Override
    public int compareTo(LessonDTO o) {
        return number - o.number;
    }
}
