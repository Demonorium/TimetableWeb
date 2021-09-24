package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Описывает одно конкретное занятие в один конкретный день,
 * ссылается на день, вид занятия и имеет список преподавателей.
 * Если список пуст должен использоваться список вида занятия.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "lessons")
public class Lesson implements Comparable<Lesson> {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    /**
     * Описание данного занятия (класс описывающий вид занятия)
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="template_id", nullable = false)
    LessonTemplate template;

    /**
     * День, в который проходит данное занятие
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="day_id", nullable = false)
    Day day;

    /**
     * ИД дня, в который проходит это занятие
     */
    @JsonGetter("day")
    public Long getDayId() {
        return day.getId();
    }

    /**
     * Место проведения занятия
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="place_id", nullable = false)
    Place place;

    /**
     * Список всех учителей проводящих занятие, перекрывает список из template
     */
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    List<Teacher> teachers = new ArrayList<>();

    /**
     * Номер данного занятия среди все занятий в течении дня
     */
    int number;

    public Lesson(LessonTemplate template, Day day, Place place, int number) {
        this.template = template;
        this.day = day;
        this.place = place;
        this.number = number;
    }

    @Override
    public int compareTo(Lesson o) {
        return number - o.number;
    }
}
