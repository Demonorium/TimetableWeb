package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * Хранит пару час-минута, используется в классе CallSchedule для представления
 * расписания звонков. Имеет возможность сортировки по штампу времени.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "hmstamps")
public class HMStamp implements Comparable<HMStamp> {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name="id")
    Long id;

    /**
     * Час
     */
    @Column(name="hour")
    byte hour;
    /**
     * Минута
     */
    @Column(name="minute")
    byte minute;

    /**
     *  Расписание использующее данную пару
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="schedule_id", nullable = false)
    CallSchedule schedule;

    /**
     * @return ИД объекта расписания данную пару
     */
    @JsonGetter("schedule")
    public Long getScheduleId() {
        return schedule.getId();
    }

    public HMStamp(byte hour, byte minute, CallSchedule schedule) {
        this.hour = hour;
        this.minute = minute;
        this.schedule = schedule;
    }

    public short getTime() {
        return (short)(((short)hour << 8) | ((short)minute));
    }
    public void setTime(short time) {
        hour = (byte)(time >> 8);
        minute = (byte) (time & 255);
    }

    @Override
    public int compareTo(HMStamp o) {
        return this.getTime() - o.getTime();
    }
}
