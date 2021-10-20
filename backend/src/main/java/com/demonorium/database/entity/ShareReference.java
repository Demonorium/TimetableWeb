package com.demonorium.database.entity;

import com.demonorium.database.Rights;
import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

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
    private String code;

    /**
     * Источник, доступ к которому даёт эта ссылка
     */
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "source_id", nullable = false)
    private Source source;

    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    /**
     * Уровень доступа
     */
    @Column(name = "rights", nullable = false)
    private Rights rights;

    /**
     * Список токнов доступа, которым дала доступ эта ссылка
     */
    @OneToMany(mappedBy = "reference", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<AccessToken> tokens = new HashSet<>();

}
