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
 * Описывает место проведения занятия аудиторией, зданием, заметкой
 */
@Data
@EqualsAndHashCode(exclude = {"source", "lessons"})
@NoArgsConstructor
@Entity
@Table(name = "places")
public class Place implements PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="place_id")
    private Long id;

    /**
     * Источник, хранящий это место
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;

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
    private String auditory;
    /**
     * Корпус/здание где проходит занятие
     */
    @Column(length = 8)
    private String building;
    /**
     * Короткая заметка о месте (не более 1 строки)
     */
    @Column(length = 50)
    private String note;

    /**
     * Список всех занятий в этом месте
     */
    @JsonIgnore
    @OneToMany(mappedBy = "place", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private Set<Lesson> lessons = new HashSet<>();

    public Place(String auditory, String building, String note, Source source) {
        this.auditory = auditory;
        this.building = building;
        this.note = note;
        this.source = source;
    }
}
