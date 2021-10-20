package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@EqualsAndHashCode(exclude = {"user", "source", "token"})
@NoArgsConstructor
@Entity
@Table(name = "priorities")
public class SourcesPriority implements Comparable<SourcesPriority> {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="priority_id")
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
     * Токен, который дал доступ (если есть)
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

    public SourcesPriority(User user, AccessToken token, int priority) {
        this.user = user;
        this.source = token.getReference().getSource();
        this.token = token;
        this.priority = priority;
    }

    public SourcesPriority(User user, Source source, int priority) {
        this.user = user;
        this.source = source;
        this.priority = priority;
    }

    @Override
    public int compareTo(SourcesPriority o) {
        return this.priority - o.priority;
    }
}
