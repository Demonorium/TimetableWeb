package com.demonorium.database.entity;

import com.demonorium.database.PartOfSource;
import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Заметка или задание
 */
@Data
@EqualsAndHashCode(exclude = {"source"})
@NoArgsConstructor
@Entity
@Table(name = "notes")
public class Note implements PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="note_id")
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
     *  Дата, на к которой относится эта заметка
     */
    @Column(name="\"date\"", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(name="text", length = 4096)
    private String text;

    /**
     * Список приложений
     */
    @OneToMany(mappedBy = "note", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<Attachment> attachments = new HashSet<>();

    public Note(Date date, String text, Source source) {
        this.source = source;
        this.date = date;
        this.text = text;
    }
}
