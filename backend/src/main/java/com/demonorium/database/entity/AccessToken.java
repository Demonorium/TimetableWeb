package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Data
@EqualsAndHashCode(exclude = {"user", "reference", "priorities"})
@NoArgsConstructor
@Entity
@Table(name = "access_tokens")
public class AccessToken {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "token_id")
    private Long id;

    /**
     * Пользователь, которому предоставлен доступ
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    /**
     * @return имя пользователя, которому предоставлен доступ
     */
    @JsonGetter("user")
    public String getUsername() {
        return user.getUsername();
    }

    /**
     * Ссылка, давшая доступ, содержит источник этого доступа
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="reference_id", nullable = false)
    private ShareReference reference;

    /**
     * Возвращает окончание ссылки
     * @return окончание ссылки
     */
    @JsonGetter("reference")
    public String getReferenceCode() {
        return reference.getCode();
    }

    /**
     * Список приоритетов, при потере доступа объект будет удалён
     */
    @OneToMany(mappedBy = "token", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<SourcesPriority> priorities = new HashSet<>();
}
