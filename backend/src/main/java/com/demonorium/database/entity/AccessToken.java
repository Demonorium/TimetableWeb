package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name = "access_tokens")
public class AccessToken {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "id")
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

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }


    /**
     * Список приоритетов, при потере доступа остаётся неисправный объект
     */
    @OneToMany(mappedBy = "token", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private Set<SourcesPriority> priorities = new HashSet<>();
}
