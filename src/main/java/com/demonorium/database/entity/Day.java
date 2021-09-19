package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

/**
 * Описывает какой-либо конкретный день
 * Может иметь собственное расписание звонков.
 * Также имеет либо ссылку на неделю, либо дату, когда он действует
 */
@Entity
@Table(name = "days")
public class Day {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;

    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name="schedule_id", nullable = true)
    private CallSchedule schedule;

    @OneToMany(mappedBy = "day", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Lesson> lessons = new HashSet<>();

    @OneToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name="week_id", nullable = true)
    private Week week;

    @JsonGetter("week")
    public Long getWeekId() {
        if (week == null)
            return null;
        return week.getId();
    }

    private Date targetDate;

    public Day() {
    }

    public Day(Source source, Date targetDate) {
        this.source = source;
        this.targetDate = targetDate;
    }

    public Day(Source source, Week week) {
        this.source = source;
        this.week = week;
    }

    public Day(Date targetDate) {
        this.targetDate = targetDate;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Week getWeek() {
        return week;
    }

    public void setWeek(Week week) {
        this.week = week;
    }

    public Date getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(Date targetDate) {
        this.targetDate = targetDate;
    }

    public CallSchedule getSchedule() {
        return schedule;
    }

    public void setSchedule(CallSchedule schedule) {
        this.schedule = schedule;
    }

    public Set<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(Set<Lesson> lessons) {
        this.lessons = lessons;
    }
}
