package com.demonorium.web;

import com.demonorium.database.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class UserAuthController {
    @Autowired
    private UserAuthentication authentication;
    @Autowired
    private WebUtils utils;

    @GetMapping("/user/register")
    ResponseEntity<String> register(HttpServletRequest request,
                                     @RequestParam("username") String username,
                                     @RequestParam("password") String password) {
        User user = authentication.newUser(username, password);
        if (user != null) {
            byte[] encoded = Base64.getEncoder()
                    .encode((username + ':' + password)
                            .getBytes(StandardCharsets.UTF_8));
            return ResponseEntity.ok(new String(encoded, StandardCharsets.UTF_8));
        }
        return ResponseEntity.badRequest().body("duplicate username");
    }
}
