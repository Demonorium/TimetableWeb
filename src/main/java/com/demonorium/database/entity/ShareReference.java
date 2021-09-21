package com.demonorium.database.entity;

import com.demonorium.database.Rights;
import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name="share_references")
public class ShareReference {
    /**
     * ИД объекта в базе
     */
    @Id
    @Column(name="code", nullable = false)
    String code;

    /**
     * Источник, доступ к которому даёт эта ссылка
     */
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "source_id", nullable = false)
    Source source;

    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    /**
     * Уровень доступа
     */
    @Column(name = "rights", nullable = false)
    Rights rights;

}
