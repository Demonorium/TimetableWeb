package com.demonorium.database.entity;

import com.demonorium.database.PartOfSource;
import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Класс представляет ссылки на 7 дней и хранит номер недели
 */
@Data
@EqualsAndHashCode(exclude = {"source", "days"})
@NoArgsConstructor
@Entity
@Table(name = "weeks")
public class Week implements PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="week_id")
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
     * Список всех дней недели
     */
    @OneToMany(mappedBy = "week", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<WeekDay> days = new HashSet<>();

    public Week(int number, Source source) {
        this.number = number;
        this.source = source;
    }
}
