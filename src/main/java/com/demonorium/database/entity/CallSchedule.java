package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

/**
 * Класс представляет расписание звонков.
 * Отдельный звонок представлен классом Timestamp. Используется TreeSet для выпода
 * списка в отсортированном виде.
 */
@Entity
@Table(name = "TABLE_CALL_SCHEDULE")
public class CallSchedule {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @JsonIgnore
    @OneToMany(mappedBy = "schedule", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private TreeSet<HMStamp> schedule = new TreeSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "schedule", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Day> days = new HashSet<>();

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    Source source;

    public Set<Day> getDays() {
        return days;
    }

    public void setDays(Set<Day> days) {
        this.days = days;
    }

    public CallSchedule() {
    }

    public CallSchedule(Source source) {
        this.source = source;
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

    public Set<HMStamp> getSchedule() {
        return schedule;
    }

    public void setSchedule(TreeSet<HMStamp> schedule) {
        this.schedule = schedule;
    }
}
