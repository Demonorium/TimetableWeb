package com.demonorium.database.entity;

import com.demonorium.database.PartOfSource;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Описывает одно конкретное занятие в один конкретный день,
 * ссылается на день, вид занятия и имеет список преподавателей.
 * Если список пуст должен использоваться список вида занятия.
 */
@Data
@EqualsAndHashCode(exclude = {"template", "day", "place", "teachers"})
@NoArgsConstructor
@Entity
@Table(name = "lessons")
public class Lesson implements Comparable<Lesson>, PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="lesson_id")
    private Long id;

    /**
     * Описание данного занятия (класс описывающий вид занятия)
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="template_id", nullable = false)
    private LessonTemplate template;

    /**
     * День, в который проходит данное занятие
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="day_id", nullable = false)
    private Day day;

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
    private Place place;

    @JsonIgnore
    @Override
    public Source getSource() {
        return template.getSource();
    }

    /**
     * Список всех учителей проводящих занятие, перекрывает список из template
     */
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private Set<Teacher> teachers = new HashSet<>();

    /**
     * Номер данного занятия среди все занятий в течении дня
     */
    private int number;

    /**
     * Добавить преподавателя к уроку
     * @param teacher - преподаватель
     */
    public void addTeacher(Teacher teacher) {
        teachers.add(teacher);
        teacher.getLessons().add(this);
    }

    /**
     * Удалить преподавателя из урока
     * @param teacher - преподаватель
     */
    public void removeTeacher(Teacher teacher) {
        teachers.remove(teacher);
        teacher.getLessons().remove(this);
    }

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

