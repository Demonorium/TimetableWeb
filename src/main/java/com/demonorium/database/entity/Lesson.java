package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Описывает одно конкретное занятие в один конкретный день,
 * ссылается на день, вид занятия и имеет список преподавателей.
 * Если список пуст должен использоваться список вида занятия.
 */
@Entity
@Table(name = "lessons")
public class Lesson implements Comparable<Lesson> {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="template_id", nullable = false)
    private LessonTemplate template;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="day_id", nullable = false)
    private Day day;

    @JsonGetter("day")
    public Long getDayId() {
        return day.getId();
    }

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="place_id", nullable = false)
    private Place place;

    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
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

