package com.demonorium.database.entity;

import javax.persistence.*;

@Entity
@Table(name = "TABLE_WEEK")
public class Week {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int number;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    Source source;

    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day monday;
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day tuesday;
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day wednesday;
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day thursday;
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day friday;
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day saturday;
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(nullable = true)
    private Day sunday;

    public Week(int number, Source source) {
        this.number = number;
        this.source = source;
    }

    public Week() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public Day getMonday() {
        return monday;
    }

    public void setMonday(Day monday) {
        this.monday = monday;
    }

    public Day getTuesday() {
        return tuesday;
    }

    public void setTuesday(Day tuesday) {
        this.tuesday = tuesday;
    }

    public Day getWednesday() {
        return wednesday;
    }

    public void setWednesday(Day wednesday) {
        this.wednesday = wednesday;
    }

    public Day getThursday() {
        return thursday;
    }

    public void setThursday(Day thursday) {
        this.thursday = thursday;
    }

    public Day getFriday() {
        return friday;
    }

    public void setFriday(Day friday) {
        this.friday = friday;
    }

    public Day getSaturday() {
        return saturday;
    }

    public void setSaturday(Day saturday) {
        this.saturday = saturday;
    }

    public Day getSunday() {
        return sunday;
    }

    public void setSunday(Day sunday) {
        this.sunday = sunday;
    }
}
