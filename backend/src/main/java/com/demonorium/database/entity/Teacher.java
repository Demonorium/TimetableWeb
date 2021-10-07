package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Описывает преподавателя, хранит имя и короткую заметку.
 * При удалении везде удаляет себя из списка преподавателей.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "teachers")
public class Teacher {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    /**
     * Источник, хранящий этого преподавателя
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source", nullable = false)
    Source source;


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
    String name;
    /**
     * Короткая заметка (не более 1 строки)
     */
    @Column(name="note", length = 50)
    String note;

    @JsonIgnore
    @ManyToMany(mappedBy = "defaultTeachers", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    Set<LessonTemplate> templates = new HashSet<>();
    @JsonIgnore
    @ManyToMany(mappedBy = "teachers", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    Set<Lesson> lessons = new HashSet<>();

    public Teacher(Source source, String name, String note) {
        this.source = source;
        this.name = name;
        this.note = note;
    }
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
