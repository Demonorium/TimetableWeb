package com.demonorium.database.entity;

import com.demonorium.database.PartOfSource;
import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.GregorianCalendar;

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
    @Column(name="\"date\"", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date date;

    /**
     *  Новое рассписание
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name="day_id", nullable = false)
    private Day day;

    public TimetableChanges(Source source, Date date, Day day) {
        this.source = source;
        this.day = day;

        setDate(date);
    }

    /**
     * Устанавливает дату, автоматически удаляет информацию о времени
     * @param date - дата изменений
     */
    public void setDate(Date date) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);

        GregorianCalendar target = new GregorianCalendar();
        target.set(GregorianCalendar.YEAR, calendar.get(GregorianCalendar.YEAR));
        target.set(GregorianCalendar.DAY_OF_YEAR, calendar.get(GregorianCalendar.DAY_OF_YEAR));

        this.date = target.getTime();
    }
}
