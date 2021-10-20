package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Описывает какой-либо конкретный день
 * Может иметь собственное расписание звонков.
 * Также имеет либо ссылку на неделю, либо дату, когда он действует
 */
@Data
@EqualsAndHashCode(exclude = {"source", "schedule", "lessons"})
@NoArgsConstructor
@Entity
@Table(name = "days")
public class Day {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="day_id")
    private Long id;

    /**
     * Источник данного дня
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;

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
    private CallSchedule schedule;

    /**
     * Список уроков данного дня
     */
    @OneToMany(mappedBy = "day", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Lesson> lessons = new HashSet<>();


    public Day(Source source) {
        this.source = source;
    }

    public Day(Source source, CallSchedule callSchedule) {
        this.source = source;
        this.schedule = callSchedule;
    }
}
