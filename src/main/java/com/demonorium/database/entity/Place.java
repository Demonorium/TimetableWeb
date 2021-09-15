package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;

/**
 * Описывает место проведения занятия аудиторией, зданием, заметкой
 */
@Entity
@Table(name = "places")
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;

    @Column(length = 6)
    private String auditory;
    @Column(length = 6)
    private String building;
    @Column(length = 50)
    private String note;

    @JsonIgnore
    @OneToMany(mappedBy = "place", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private List<Lesson> lessons = new ArrayList<>();

    public Place() {
    }

    public Place(String auditory, String building, String note, Source source) {
        this.auditory = auditory;
        this.building = building;
        this.note = note;
        this.source = source;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuditory() {
        return auditory;
    }

    public void setAuditory(String auditory) {
        this.auditory = auditory;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
