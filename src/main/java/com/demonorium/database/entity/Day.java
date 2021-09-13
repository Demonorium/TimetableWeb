package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

@Entity
@Table(name = "TABLE_DAY")
public class Day {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    CallSchedule schedule;

    @JsonIgnore
    @OneToMany(mappedBy = "day", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private TreeSet<Lesson> lessons = new TreeSet<>();

    @OneToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Week week;

    private Date targetDate;

    public Day() {
    }

    public Day(Week week) {
        this.week = week;
    }
    public Day(Date targetDate) {
        this.targetDate = targetDate;
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

    public TreeSet<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(TreeSet<Lesson> lessons) {
        this.lessons = lessons;
    }
}
