package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.util.*;

/**
 * Класс представляет расписание звонков.
 * Отдельный звонок представлен классом Timestamp. Используется TreeSet для выпода
 * списка в отсортированном виде.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "schedules")
public class CallSchedule {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    /**
     * Множество всех объектов времени, относящихся в данному расписанию звонков
     */
    @OneToMany(mappedBy = "schedule", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<HMStamp> schedule = new ArrayList<>();
    /**
     * Множество всех дней, использующих данное расписание звонков
     */
    @JsonIgnore
    @OneToMany(mappedBy = "schedule", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    Set<Day> days = new HashSet<>();

    /**
     *  Источник хранящий данное расписание
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    Source source;

    /**
     * @return ИД источника хранящего данное расписание
     */
    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    public CallSchedule(Source source) {
        this.source = source;
    }
}
