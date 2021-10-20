package com.demonorium.database.entity;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;


/**
 * Описывает год и день этого года, используется для описания
 * заданий и изменений на конкретную дату
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "date_pairs")
public class YearDayPair {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="date_pair_id")
    private Long id;

    /**
     * Год, когда описываемое событие актуально
     */
    @Column(name="year")
    private int year;

    /**
     * День года, когда описываемое событие актуально
     */
    @Column(name="day")
    private int day;

    public YearDayPair(int year, int day) {
        this.year = year;
        this.day = day;
    }

    public YearDayPair(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);

        this.year = calendar.get(Calendar.YEAR);
        this.day = calendar.get(Calendar.DAY_OF_YEAR);
    }
}

