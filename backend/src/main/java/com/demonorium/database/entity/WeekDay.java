package com.demonorium.database.entity;

import com.demonorium.database.PartOfSource;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@EqualsAndHashCode(exclude = {"week", "day"})
@NoArgsConstructor
@Entity
@Table(name = "week_days")
public class WeekDay implements PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="week_day_id")
    private Long id;

    /**
     * Номер дня недели
     */
    private int number;

    /**
     * Неделя к которой относится день недели
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="week_id", nullable = false)
    private Week week;

    /**
     * Рассписание на этот день
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name="day_id", nullable = false)
    private Day day;

    @JsonIgnore
    @Override
    public Source getSource() {
        return week.getSource();
    }
}
