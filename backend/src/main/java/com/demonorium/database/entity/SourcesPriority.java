package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "priorities")
public class SourcesPriority implements Comparable<SourcesPriority> {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id")
    private Long id;

    /**
     * Пользователь, которому принадлежит список приоритетов
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * @return имя вледельца источника
     */
    @JsonGetter("user")
    public String getUserName() {
        return user.getUsername();
    }

    /**
     * Источник, к которому предоставлен доступ
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="source_id", nullable = false)
    private Source source;

    /**
     * Токен, который дал доступ
     */
    @JsonIgnore
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name="token_id", nullable = true)
    private AccessToken token;

    /**
     * @return ИД источника, к которому предоставлен доступ
     */
    @JsonGetter("source")
    public Long getSourceId() {
        return source.getId();
    }

    /**
     * Приоритет источника
     */
    @Column(name="priority", nullable = false)
    private int priority;

    @Override
    public int compareTo(SourcesPriority o) {
        return this.priority - o.priority;
    }
}
