package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jdk.nashorn.internal.objects.annotations.Getter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Класс представляет ссылки на 7 дней и хранит номер недели
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "weeks")
public class Week {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    /**
     * Номер недели
     */
    int number;

    /**
     * Источник, хранящий описание этой недели
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    Source source;

    /**
     * @return ИД источника, хранящего описание этой недели
     */
    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    /**
     * Объект дня для: понедельника
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    Day monday;
    /**
     * Объект дня для: вторника
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    Day tuesday;
    /**
     * Объект дня для: среды
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    Day wednesday;
    /**
     * Объект дня для: четверга
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    Day thursday;
    /**
     * Объект дня для: пятницы
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    Day friday;
    /**
     * Объект дня для: субботы
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    Day saturday;
    /**
     * Объект дня для: воскресенья
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    Day sunday;

    public Week(int number, Source source) {
        this.number = number;
        this.source = source;
    }
}
