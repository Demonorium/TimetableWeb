package com.demonorium.database.entity;

import com.demonorium.database.PartOfSource;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@EqualsAndHashCode(exclude = {"note"})
@NoArgsConstructor
@Entity
@Table(name = "attachments")
public class Attachment implements PartOfSource {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="attachment_id")
    private Long id;


    /**
     * Заметка к которой относится приложение
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="note_id", nullable = false)
    private Note note;

    /**
     * Пусть к объекту на который ссылается данное приложение
     */
    @Column(name="path", length=1024)
    private String path;

    @Override
    public Source getSource() {
        return note.getSource();
    }

    public Attachment(String path, Note note) {
        this.note = note;
        this.path = path;
    }
}
