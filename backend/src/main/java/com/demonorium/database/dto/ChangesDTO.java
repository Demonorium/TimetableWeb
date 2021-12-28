package com.demonorium.database.dto;

import com.demonorium.database.entity.TimetableChanges;
import lombok.Data;
import lombok.NonNull;

@Data
public class ChangesDTO {
    /**
     * ИД объекта изменений в базе данных
     */
    private Long id;

    /**
     * Код дня на который произшли изменения
     */
    private Long day;

    /**
     * Дата на которую произошли изменения
     */
    private Long date;

    /**
     * Приоритет
     */
    private int priority;

    /**
     * Источник
     */
    private Long source;

    public ChangesDTO(@NonNull TimetableChanges changes, int priority) {
        this.id = changes.getId();
        this.day = changes.getDay().getId();
        this.date = changes.getDate().getTime();
        this.priority = priority;
        this.source = changes.getSourceId();
    }
}
