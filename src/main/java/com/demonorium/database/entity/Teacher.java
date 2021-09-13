package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Описывает преподавателя, хранит имя и короткую заметку.
 * При удалении везде удаляет себя из списка преподавателей.
 */
@Entity
@Table(name = "TABLE_TEACHER")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    Source source;

    @Column(length = 50)
    private String name;
    @Column(length = 50)
    private String note;

    @ManyToMany(mappedBy = "defaultTeachers", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private List<LessonTemplate> templates = new ArrayList<>();
    @ManyToMany(mappedBy = "teachers", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private List<Lesson> lessons = new ArrayList<>();

    public Teacher() {
    }

    public Teacher(Source source, String name, String note) {
        this.source = source;
        this.name = name;
        this.note = note;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public List<LessonTemplate> getTemplates() {
        return templates;
    }

    public void setTemplates(List<LessonTemplate> templates) {
        this.templates = templates;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    public Teacher(String name, String note) {
        this.name = name;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
