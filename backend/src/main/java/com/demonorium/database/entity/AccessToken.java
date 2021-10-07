package com.demonorium.database.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Objects;

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
    Long id;

    /**
     * Пользователь, которому предоставлен доступ
     */
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name="user_id", nullable = false)
    User user;

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
    ShareReference reference;

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
