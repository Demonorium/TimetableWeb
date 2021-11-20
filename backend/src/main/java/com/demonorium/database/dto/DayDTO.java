package com.demonorium.database.dto;


import com.demonorium.database.entity.CallPair;
import com.demonorium.database.entity.Day;
import lombok.Data;

import java.util.ArrayList;
import java.util.Collections;

@Data
public class DayDTO {
    /**
     * ИД объекта в базе
     */
    Long id;

    /**
     * Расписание звонков
     */
    ArrayList<CallPair> schedule;

    /**
     * Уроки
     */
    private ArrayList<LessonDTO> lessons;

    /**
     * Источник
     */
    private Long source;

    public DayDTO(Day day) {
        this.id = day.getId();
        this.source = day.getSourceId();

        if (day.getSchedule() != null) {
            this.schedule = new ArrayList<>(day.getSchedule().getSchedule());
            Collections.sort(this.schedule);
        } else {
            this.schedule = null;
        }
        this.lessons = new ArrayList<>();
        day.getLessons().forEach(lesson -> lessons.add(new LessonDTO(lesson)));
    }
}
