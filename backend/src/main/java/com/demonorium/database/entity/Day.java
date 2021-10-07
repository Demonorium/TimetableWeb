package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.*;

/**
 * Описывает какой-либо конкретный день
 * Может иметь собственное расписание звонков.
 * Также имеет либо ссылку на неделю, либо дату, когда он действует
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "days")
public class Day {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    /**
     * Источник данного дня
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    Source source;

    /**
     * ИД источника данного дня
     */
    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    /**
     * Рассписание звонков данного дня
     */
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name="schedule_id", nullable = true)
    CallSchedule schedule;

    /**
     * Список уроков данного дня
     */
    @OneToMany(mappedBy = "day", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    Set<Lesson> lessons = new HashSet<>();

    /**
     * Если день привязан к какому-то дню одной из недель, то данное поле указывает на эту неделю.
     * В противном случае данное поле должно быть null.
     */
    @OneToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name="week_id", nullable = true)
    Week week;

    /**
     * @return Возвращает ИД недели, если день привязан к неделе, в противном случае null.
     */
    @JsonGetter("week")
    public Long getWeekId() {
        if (week == null)
            return null;
        return week.getId();
    }

    /**
     * Хранит дату которой привязан данный день, если день привязан к неделе, то поле равно null.
     * Если данное поле установлено, то в эту дату будет использовано это расписание.
     */
    Date targetDate;

    public Day(Source source, Date targetDate) {
        this.source = source;
        this.setTargetDate(targetDate);
    }

    public Day(Source source, Week week) {
        this.source = source;
        this.week = week;
    }

    public void setTargetDate(Date targetDate) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(targetDate);

        Calendar simpleCalendar = new GregorianCalendar();
        simpleCalendar.set(GregorianCalendar.YEAR, calendar.get(GregorianCalendar.YEAR));
        simpleCalendar.set(GregorianCalendar.DAY_OF_YEAR, calendar.get(GregorianCalendar.DAY_OF_YEAR));

        this.targetDate = simpleCalendar.getTime();
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
