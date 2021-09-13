package com.demonorium.database.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;


@Entity
@Table(name = "TABLE_USERS")
public class User {
    @Id
    private String username;
    private String password;

    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Source> sources = new LinkedList<>();


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
