package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.PartOfSource;
import com.demonorium.database.Rights;
import com.demonorium.database.entity.Source;
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

    @Autowired
    private DatabaseService databaseService;

    public  <T extends PartOfSource> boolean hasAccess(HttpServletRequest request, Optional<T> partOfSource, Rights rights) {
        return databaseService.hasAccess(getUser(request), partOfSource.get(), rights);
    }

    public boolean hasAccess(HttpServletRequest request, PartOfSource partOfSource, Rights rights) {
        return databaseService.hasAccess(getUser(request), partOfSource, rights);
    }

    public boolean hasAccess(HttpServletRequest request, Source source, Rights rights) {
        return databaseService.hasAccess(getUser(request), source, rights);
    }

    public User getUser(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();

        if (principal == null) {
            return null;
        }

        Optional<User> user = userRepository.findByUsername(principal.getName());

        return user.orElse(null);
    }
}
