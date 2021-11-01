package com.demonorium.database.entity;

import com.demonorium.database.PartOfSource;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Хранит пару (час,минута), представляет описание звонка для CallSchedule
 * Имеет возможность сортировки по времени.
 */
@Data
@EqualsAndHashCode(exclude = {"schedule"})
@NoArgsConstructor
@Entity
@Table(name = "call_pairs")
public class CallPair implements Comparable<CallPair>, PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name="call_pair_id")
    private Long id;

    /**
     * Час
     */
    @Column(name="hour")
    private byte hour;
    /**
     * Минута
     */
    @Column(name="minute")
    private byte minute;

    /**
     *  Расписание использующее данную пару
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="schedule_id", nullable = false)
    private CallSchedule schedule;

    /**
     * @return ИД объекта расписания данную пару
     */
    @JsonGetter("schedule")
    public Long getScheduleId() {
        return schedule.getId();
    }

    public CallPair(CallSchedule schedule, byte hour, byte minute) {
        this.hour = hour;
        this.minute = minute;
        this.schedule = schedule;
    }

    @JsonIgnore
    @Override
    public Source getSource() {
        return schedule.getSource();
    }

    /**
     * Возвращает числовое представление объекта, так, что
     * CallPair(H1, M1).getTime() < CallPair(H2, M2).getTime()
     * Если (H1 < H2) || ((H1 == H2) && (M1 < M2))
     * @return 16 бит содержащие штамп времени
     */
    @JsonGetter("time")
    public short getTime() {
        return (short)(((short)hour << 8) | ((short)minute));
    }

    /**
     * Принимает штамп полученный из getTime
     * @param time шестнадцатибитный штамп
     */
    @JsonSetter("time")
    public void setTime(short time) {
        hour = (byte)(time >> 8);
        minute = (byte) (time & 255);
    }

    @Override
    public int compareTo(CallPair o) {
        return this.getTime() - o.getTime();
    }
}
