package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.util.*;

/**
 * Класс представляет расписание звонков.
 * Отдельный звонок представлен классом Timestamp. Используется TreeSet для выпода
 * списка в отсортированном виде.
 */
@Entity
@Table(name = "schedules")
public class CallSchedule {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<HMStamp> schedule = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "schedule", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private Set<Day> days = new HashSet<>();

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;

    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

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

    public void setSchedule(Set<HMStamp> schedule) {
        this.schedule = schedule;
    }
}
