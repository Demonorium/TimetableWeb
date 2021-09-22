package com.demonorium.config;

import com.demonorium.database.entity.User;
import com.demonorium.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Locale;
import java.util.Optional;

@Configuration
class SecurityConfig extends
        GlobalAuthenticationConfigurerAdapter implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    static private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Optional<User> user = repository.findById(username);
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
    public boolean newUser(String username, String password) {
        Optional<User> user = repository.findById(username);
        if (!user.isPresent()) {
            User newUser = new User(username, encoder.encode(password));
            repository.save(newUser);
            return true;
        }
        return false;
    }

    /**
     * Удалить пользователя
     * @param username уникальное пользователя
     * @param password пароль пользователя
     * @return true в случае успешного удаления, false в случае ошибки
     */
    public boolean removeUser(String username, String password) {
        Optional<User> user = repository.findById(username);
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
        Optional<User> user = repository.findById(username);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            user.get().setPassword(encoder.encode(newPassword));
            repository.save(user.get());
            return true;
        }
        return false;
    }

}
