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
 * Описывает вид занятия. Хранит название, короткую заметку.
 */
@Data
@EqualsAndHashCode(exclude = {"source", "defaultTeachers", "lessons"})
@NoArgsConstructor
@Entity
@Table(name = "lesson_templates")
public class LessonTemplate implements PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="template_id")
    private Long id;

    /**
     * Источник, хранящий это описание занятия
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;


    /**
     * @return Возвращает ИД источника, хранящего это описание занятия
     */
    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    /**
     * Название занятия
     */
    @Column(length = 50)
    private String name;
    /**
     * Короткая заметка (не более 1 строки)
     */
    @Column(length = 50)
    private String note;

    /**
     * Количество часов, отведённое на предмет
     */
    private int hours;

    /**
     * Список преподавателей
     */
    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private Set<Teacher> defaultTeachers = new HashSet<>();

    /**
     * Список всех занятий этого вида
     */
    @JsonIgnore
    @OneToMany(mappedBy = "template", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Lesson> lessons = new HashSet<>();

    /**
     * Добавить преподавателя к занятию
     * @param teacher - преподаватель
     */
    public void addTeacher(Teacher teacher) {
        defaultTeachers.add(teacher);
        teacher.getTemplates().add(this);
    }

    /**
     * Удалить преподавателя из занятия
     * @param teacher - преподаватель
     */
    public void removeTeacher(Teacher teacher) {
        defaultTeachers.remove(teacher);
        teacher.getTemplates().remove(this);
    }

    public LessonTemplate(String name, String note, int hours, Source source) {
        this.name = name;
        this.note = note;
        this.source = source;
        this.hours = hours;
    }
}
