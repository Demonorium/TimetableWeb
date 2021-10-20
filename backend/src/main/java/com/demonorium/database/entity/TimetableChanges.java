package com.demonorium.database.entity;

import com.demonorium.database.PartOfSource;
import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@EqualsAndHashCode(exclude = {"source", "day"})
@NoArgsConstructor
@Entity
@Table(name = "timetable_changes")
public class TimetableChanges implements PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="changes_id")
    private Long id;

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
     *  Дата, на которую произошли изменения
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name="date_pair_id", nullable = false)
    private YearDayPair date;

    /**
     *  Новое рассписание
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name="day_id", nullable = false)
    private Day day;

    public TimetableChanges(Source source, YearDayPair date, Day day) {
        this.source = source;
        this.date = date;
        this.day = day;
    }
}
