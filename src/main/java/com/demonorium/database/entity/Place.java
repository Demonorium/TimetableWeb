package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;

/**
 * Описывает место проведения занятия аудиторией, зданием, заметкой
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "places")
public class Place {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    Long id;

    /**
     * Источник, хранящий это место
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    Source source;

    /**
     * @return ИД источника, хранящего это место
     */
    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    /**
     * Аудитория, где проходит занятие
     */
    @Column(length = 8)
    String auditory;
    /**
     * Корпус/здание где проходит занятие
     */
    @Column(length = 8)
    String building;
    /**
     * Короткая заметка о месте (не более 1 строки)
     */
    @Column(length = 50)
    String note;

    /**
     * Список всех занятий в этом месте
     */
    @JsonIgnore
    @OneToMany(mappedBy = "place", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    List<Lesson> lessons = new ArrayList<>();

    public Place(String auditory, String building, String note, Source source) {
        this.auditory = auditory;
        this.building = building;
        this.note = note;
        this.source = source;
    }
}
