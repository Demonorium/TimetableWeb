package com.demonorium.web;

import com.demonorium.database.DatabaseController;
import com.demonorium.database.entity.User;
import com.demonorium.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.Optional;

@Component
public class WebUtils {
    @Autowired
    UserRepository userRepository;

    User getUser(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        if (principal == null)
            return null;
        Optional<User> user = userRepository.findById(principal.getName());
        return user.orElse(null);
    }
}
