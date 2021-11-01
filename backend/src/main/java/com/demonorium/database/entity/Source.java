package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Описывает источник информации о расписании.
 */
@Data
@EqualsAndHashCode(exclude = {
        "defaultSchedule", "owner", "teachers",
        "days", "schedules", "templates",
        "places", "weeks", "reference",
        "priorities", "changes"
})
@NoArgsConstructor
@Entity
@Table(name = "sources")
public class Source {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="source_id")
    private Long id;

    /**
     * Название расписания
     */
    @Column(length = 50)
    private String name;

    /**
     * Стандартное расписание звокнов, указывается для дня, если не было указано другого или
     * раписание звонков было удалено
     */
    @OneToOne(optional = true, cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JoinColumn(name="default_schedule_id", nullable = true)
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
    private Set<Teacher> teachers = new HashSet<>();

    /**
     * Список дней
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Day> days = new HashSet<>();

    /**
     * Список расписаний звонков
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<CallSchedule> schedules = new HashSet<>();

    /**
     * Список видов занятий
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<LessonTemplate> templates = new HashSet<>();

    /**
     * Список мест
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Place> places = new HashSet<>();

    /**
     * Список недель
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Week> weeks = new HashSet<>();

    /**
     * Список токенов доступа к этому источнику
     */
    @OneToOne(mappedBy = "source", cascade = CascadeType.REMOVE, optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name="reference_id", nullable = true)
    private ShareReference reference;

    /**
     * Список приоритетов, удаляемых при потере доступа
     */
    @JsonIgnore
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<SourcesPriority> priorities = new HashSet<>();

    /**
     * Список изменений
     */
    @OneToMany(mappedBy = "source", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<TimetableChanges> changes = new HashSet<>();
}
