package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Описывает вид занятия. Хранит название, короткую заметку.
 */
@Entity
@Table(name = "lesson_templates")
public class LessonTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;

    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    @Column(length = 255)
    private String name;
    @Column(length = 50)
    private String note;

    @ManyToMany(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private List<Teacher> defaultTeachers = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "template", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Lesson> lessons = new ArrayList<>();

    public LessonTemplate() {
    }

    public LessonTemplate(String name, String note, Source source) {
        this.name = name;
        this.note = note;
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

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public List<Teacher> getDefaultTeachers() {
        return defaultTeachers;
    }

    public void setDefaultTeachers(List<Teacher> defaultTeachers) {
        this.defaultTeachers = defaultTeachers;
    }
}
