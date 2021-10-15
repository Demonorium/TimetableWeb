package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Objects;

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
    private Long id;

    /**
     * Номер недели
     */
    private int number;

    /**
     * Источник, хранящий описание этой недели
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;

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
    private Day monday;
    /**
     * Объект дня для: вторника
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day tuesday;
    /**
     * Объект дня для: среды
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day wednesday;
    /**
     * Объект дня для: четверга
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day thursday;
    /**
     * Объект дня для: пятницы
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day friday;
    /**
     * Объект дня для: субботы
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day saturday;
    /**
     * Объект дня для: воскресенья
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day sunday;

    public Week(int number, Source source) {
        this.number = number;
        this.source = source;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
