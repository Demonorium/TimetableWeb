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
 * Описывает преподавателя, хранит имя и короткую заметку.
 * При удалении везде удаляет себя из списка преподавателей.
 */
@Data
@EqualsAndHashCode(exclude = {"source", "templates", "lessons"})
@NoArgsConstructor
@Entity
@Table(name = "teachers")
public class Teacher implements PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="teacher_id")
    private Long id;

    /**
     * Источник, хранящий этого преподавателя
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source", nullable = false)
    private Source source;


    /**
     * @return ИД источника, хранящего этого преподавателя
     */
    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    /**
     * Имя преподавателя
     */
    @Column(name="name", length = 50)
    private String name;

    /**
     * Должность преподавателя
     */
    @Column(name="position", length = 50)
    private String position;

    /**
     * Короткая заметка (не более 1 строки)
     */
    @Column(name="note", length = 50)
    private String note;

    @JsonIgnore
    @ManyToMany(mappedBy = "defaultTeachers", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private Set<LessonTemplate> templates = new HashSet<>();
    @JsonIgnore
    @ManyToMany(mappedBy = "teachers", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private Set<Lesson> lessons = new HashSet<>();

    public Teacher(Source source, String name, String note) {
        this.source = source;
        this.name = name;
        this.note = note;
    }
}
