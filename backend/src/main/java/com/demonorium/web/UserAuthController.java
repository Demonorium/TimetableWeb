package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;


@RestController
public class UserAuthController {
    @Autowired
    private DatabaseService databaseService;

    @Autowired
    private UserAuthentication authentication;

    @Autowired
    private WebUtils webUtils;

    @GetMapping("/user/login")
    ResponseEntity<String> login(@RequestParam("username") String username,
                                 @RequestParam("password") String password) {
        Optional<User> user = databaseService.getUserRepository().findByUsername(username);
        if (user.isPresent()) {
            if (authentication.checkPassword(user.get().getPassword(), password)) {
                return ResponseEntity.ok().body("success");
            } else {
                return ResponseEntity.badRequest().body("password incorrect");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/register")
    ResponseEntity<String> register(@RequestParam("username") String username,
                                    @RequestParam("password") String password) {
        User user = authentication.newUser(username, password);

        if (user != null) {
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.badRequest().body("duplicate username");
    }

    @GetMapping("/user/change_password")
    ResponseEntity<String> changePassword(HttpServletRequest request,
                                          @RequestParam("password") String password,
                                          @RequestParam("newPassword") String newPassword) {
        User user = webUtils.getUser(request);

        if (user != null) {
            if (authentication.changePassword(user.getUsername(), password, newPassword)) {
                return ResponseEntity.ok("success");
            };

            return ResponseEntity.badRequest().body("Error during changing");
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/delete")
    ResponseEntity<String> delete(HttpServletRequest request,
                                  @RequestParam("password") String password) {
        User user = webUtils.getUser(request);
        if (user != null) {
            if (authentication.removeUser(user.getUsername(), password)) {
                ResponseEntity.ok("success");
            }
            return ResponseEntity.badRequest().body("Error during deleting");
        }

        return ResponseEntity.notFound().build();
    }
}
