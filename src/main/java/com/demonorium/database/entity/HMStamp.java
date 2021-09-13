package com.demonorium.database.entity;

import javax.persistence.*;

/**
 * Хранит пару час-минута, используется в классе CallSchedule для представления
 * расписания звонков.
 */
@Entity
@Table(name = "TABLE_TIMESTAMP")
public class HMStamp implements Comparable<HMStamp> {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    private byte hour;
    private byte minute;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private CallSchedule schedule;

    public HMStamp() {
    }

    public HMStamp(byte hour, byte minute, CallSchedule schedule) {
        this.hour = hour;
        this.minute = minute;
        this.schedule = schedule;
    }

    public CallSchedule getSchedule() {
        return schedule;
    }

    public void setSchedule(CallSchedule schedule) {
        this.schedule = schedule;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte getHour() {
        return hour;
    }

    public void setHour(byte hour) {
        this.hour = hour;
    }

    public byte getMinute() {
        return minute;
    }

    public void setMinute(byte minute) {
        this.minute = minute;
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
