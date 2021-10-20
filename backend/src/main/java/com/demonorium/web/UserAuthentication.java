package com.demonorium.web;

import com.demonorium.database.entity.User;
import com.demonorium.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserAuthentication extends
        GlobalAuthenticationConfigurerAdapter implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Optional<User> user = repository.findByUsername(username);
        if (!user.isPresent())
            throw new UsernameNotFoundException("Unknown username: " + username);

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.get().getUsername())
                .password(user.get().getPassword())
                .roles("normal_user")
                .build();
    }

    /**
     * Создать нового пользователя
     * @param username уникальное имя пользователя
     * @param password пароль пользователя
     * @return true в случае успешного создания, false в случае ошибки
     */
    public User newUser(String username, String password) {
        Optional<User> user = repository.findByUsername(username);
        if (!user.isPresent()) {
            User newUser = new User(username, encoder.encode(password));
            repository.save(newUser);

            return newUser;
        }
        return null;
    }

    /**
     * Удалить пользователя
     * @param username имя пользователя
     * @param password пароль пользователя
     * @return true в случае успешного удаления, false в случае ошибки
     */
    public boolean removeUser(String username, String password) {
        Optional<User> user = repository.findByUsername(username);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            repository.delete(user.get());
            return true;
        }
        return false;
    }

    /**
     * Сменить пароль пользователя
     * @param username имя пользователя
     * @param password текущий пароль пользователя
     * @param newPassword новый пароль пользователя
     * @return true в случае успешной смены пароля, false иначе
     */
    public boolean changePassword(String username, String password, String newPassword) {
        Optional<User> user = repository.findByUsername(username);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            user.get().setPassword(encoder.encode(newPassword));
            repository.save(user.get());
            return true;
        }
        return false;
    }

}
