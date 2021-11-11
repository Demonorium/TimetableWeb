package com.demonorium.database.dto;

import com.demonorium.database.entity.CallPair;
import com.demonorium.database.entity.Source;
import lombok.Data;

import java.util.ArrayList;
import java.util.Collections;

@Data
public class SourceDto {
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

    public SourceDto(Source source) {
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
    }
}
