package com.demonorium.database.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;


/**
 * Класс описывает пользователя, хранит ник и пароль
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    /**
     * Имя пользователя, является уникальным идентификатором пользователя
     */
    @Id
    @Column(name="username", length = 50)
    String username;
    /**
     * Хэшкод пароля пользователя
     */
    @JsonIgnore
    @Column(name="password_hash", length = 256)
    String password;

    /**
     * Список источников, которыми владеет пользователь
     */
    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<Source> sources = new LinkedList<>();

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
