package com.demonorium.database.dto;

import com.demonorium.database.entity.CallPair;
import com.demonorium.database.entity.Day;
import lombok.Data;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class DayDTO {
    /**
     * ИД объекта в базе
     */
    private Long id;

    /**
     * Расписание звонков
     */
    private List<CallPair> schedule;

    /**
     * Уроки
     */
    private List<LessonDTO> lessons;

    /**
     * Источник
     */
    private Long source;

    public DayDTO(@NonNull Day day) {
        this.id = day.getId();
        this.source = day.getSourceId();

        if (day.getSchedule() != null) {
            this.schedule = new ArrayList<>(day.getSchedule().getSchedule());
            Collections.sort(this.schedule);
        } else {
            this.schedule = null;
        }

        this.lessons = day.getLessons().stream()
                .map(LessonDTO::new)
                .sorted()
                .collect(Collectors.toList());
    }
}
