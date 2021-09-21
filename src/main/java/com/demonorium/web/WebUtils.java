package com.demonorium.web;

import com.demonorium.database.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.Optional;

@Controller
public class WebUtils {
    @Autowired
    DatabaseController database;

    User getUser(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        if (principal == null)
            return null;
        Optional<User> user = database.user.findById(principal.getName());
        return user.orElse(null);
    }
}
