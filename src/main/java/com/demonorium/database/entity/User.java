package com.demonorium.database.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;


@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name="username", length = 50)
    private String username;
    @Column(name="password_hash", length = 256)
    private String password;

    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Source> sources = new LinkedList<>();

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
