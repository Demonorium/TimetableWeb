package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;

/**
 * Описывает источник информации о расписании.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "sources")
public class Source {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    Long id;

    /**
     * Стандартное расписание звокнов, указывается для дня, если не было указано другого или
     * раписание звонков было удалено
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(name="default_schedule", nullable = true)
    CallSchedule defaultSchedule;

    /**
     * Владелец этого источника
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_name", nullable = false)
    User owner;

    /**
     * @return имя вледельца источника
     */
    @JsonGetter("owner")
    public String getOwnerName() {
        return owner.getUsername();
    }

    public Source(CallSchedule defaultSchedule, User owner) {
        this.defaultSchedule = defaultSchedule;
        this.owner = owner;
    }
    public Source(User owner) {
        this.owner = owner;
    }

    /**
     * Список учителей
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<Teacher> teachers = new LinkedList<>();

    /**
     * Список дней
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<Day> days = new LinkedList<>();

    /**
     * Список расписаний звонков
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<CallSchedule> schedules = new LinkedList<>();

    /**
     * Список видов занятий
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<LessonTemplate> templates = new LinkedList<>();

    /**
     * Список мест
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<Place> places = new LinkedList<>();

    /**
     * Список недель
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<Week> weeks = new LinkedList<>();
}
