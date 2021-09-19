package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonGetter;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Описывает источник информации о расписании.
 */
@Entity
@Table(name = "sources")
public class Source {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    private Long id;

    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(name="default_schedule", nullable = true)
    private CallSchedule defaultSchedule;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_name", nullable = false)
    private User owner;

    @JsonGetter("owner")
    public String getOwnerName() {
        return owner.getUsername();
    }

    public Source() {
    }

    public Source(CallSchedule defaultSchedule, User owner) {
        this.defaultSchedule = defaultSchedule;
        this.owner = owner;
    }
    public Source(User owner) {
        this.owner = owner;
    }

    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Teacher> teachers = new LinkedList<>();

    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Day> days = new LinkedList<>();

    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<CallSchedule> schedules = new LinkedList<>();

    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<LessonTemplate> templates = new LinkedList<>();

    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Place> places = new LinkedList<>();

    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Week> weeks = new LinkedList<>();

    public List<Day> getDays() {
        return days;
    }

    public void setDays(List<Day> days) {
        this.days = days;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CallSchedule getDefaultSchedule() {
        return defaultSchedule;
    }

    public void setDefaultSchedule(CallSchedule defaultSchedule) {
        this.defaultSchedule = defaultSchedule;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<Teacher> getTeachers() {
        return teachers;
    }

    public void setTeachers(List<Teacher> teachers) {
        this.teachers = teachers;
    }

    public List<CallSchedule> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<CallSchedule> schedules) {
        this.schedules = schedules;
    }

    public List<LessonTemplate> getTemplates() {
        return templates;
    }

    public void setTemplates(List<LessonTemplate> templates) {
        this.templates = templates;
    }

    public List<Place> getPlaces() {
        return places;
    }

    public void setPlaces(List<Place> places) {
        this.places = places;
    }

    public List<Week> getWeeks() {
        return weeks;
    }

    public void setWeeks(List<Week> weeks) {
        this.weeks = weeks;
    }
}
