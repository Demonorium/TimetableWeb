package com.demonorium.database.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;


/**
 * Класс описывает пользователя, хранит ник и пароль
 */
@Data
@EqualsAndHashCode(exclude = {"sources", "tokens", "priorities"})
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    /**
     * ИД объекта в базе
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="user_id")
    private Long id;

    /**
     * Имя пользователя, является уникальным идентификатором пользователя
     */
    @Column(name="username", length = 50, unique = true)
    private String username;
    /**
     * Хэшкод пароля пользователя
     */
    @JsonIgnore
    @Column(name="password_hash", length = 256)
    private String password;

    /**
     * Список источников, которыми владеет пользователь
     */
    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Source> sources = new LinkedList<>();

    /**
     * Список токнов доступа, которыми владеет пользователь
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<AccessToken> tokens = new HashSet<>();

    /**
     * Приоритеты источников
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private Set<SourcesPriority> priorities = new HashSet<>();

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
