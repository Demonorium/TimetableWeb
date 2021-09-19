package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

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
    private Long id;

    /**
     * Стандартное расписание звокнов, указывается для дня, если не было указано другого или
     * раписание звонков было удалено
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(name="default_schedule", nullable = true)
    private CallSchedule defaultSchedule;

    /**
     * Владелец этого источника
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_name", nullable = false)
    private User owner;

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
    private List<Teacher> teachers = new LinkedList<>();

    /**
     * Список дней
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Day> days = new HashSet<>();

    /**
     * Список расписаний звонков
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<CallSchedule> schedules = new LinkedList<>();

    /**
     * Список видов занятий
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<LessonTemplate> templates = new LinkedList<>();

    /**
     * Список мест
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Place> places = new LinkedList<>();

    /**
     * Список недель
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Week> weeks = new LinkedList<>();
}
