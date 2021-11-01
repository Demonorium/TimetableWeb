package com.demonorium.database.dto;

import com.demonorium.database.entity.CallPair;
import com.demonorium.database.entity.Lesson;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder(setterPrefix="with")
public class ChangesDto {
    /**
     * ИД объекта изменений в базе данных
     */
    private Long id;

    /**
     * Список изменений дня
     */
    private List<Lesson> lessons;
    /**
     * Расписание звонков по умолчанию
     */
    private List<CallPair> schedule;

    /**
     * Год на который запрошены изменений
     */
    private int year;

    /**
     * День года на который запрошены изменения
     */
    private int day;

}
