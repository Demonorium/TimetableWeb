package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "TABLE_LESSON")
public class Lesson implements Comparable<Lesson> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private LessonTemplate template;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private Day day;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private Place place;

    @JsonIgnore
    @ManyToMany(mappedBy = "lessons", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private List<Teacher> teachers = new ArrayList<>();

    private int number;

    public Lesson() {
    }

    public Lesson(LessonTemplate template, Day day, Place place, int number) {
        this.template = template;
        this.day = day;
        this.place = place;
        this.number = number;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LessonTemplate getTemplate() {
        return template;
    }

    public void setTemplate(LessonTemplate template) {
        this.template = template;
    }

    public Day getDay() {
        return day;
    }

    public void setDay(Day day) {
        this.day = day;
    }

    public Place getPlace() {
        return place;
    }

    public void setPlace(Place place) {
        this.place = place;
    }

    public List<Teacher> getTeachers() {
        return teachers;
    }

    public void setTeachers(List<Teacher> teachers) {
        this.teachers = teachers;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    @Override
    public int compareTo(Lesson o) {
        return number - o.number;
    }
}

