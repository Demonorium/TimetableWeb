package com.demonorium.web;

import com.demonorium.database.DatabaseService;
import com.demonorium.database.entity.User;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Data
    private static class UserPostObject {
        private String username;
        private String password;
    }

    @Data
    private static class PasswordChangePostObject {
        private String newPassword;
        private String password;
    }

    @Data
    private static class DeletePostObject {
        private String password;
    }

    @PostMapping("/user/login")
    ResponseEntity<String> login(@RequestBody UserPostObject userPostObject) {
        Optional<User> user = databaseService.getUserRepository().findByUsername(userPostObject.getUsername());
        if (user.isPresent()) {
            if (authentication.checkPassword(user.get().getPassword(), userPostObject.getPassword())) {
                return ResponseEntity.ok("success");
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/user/register")
    ResponseEntity<String> register(@RequestBody UserPostObject userPostObject) {
        User user = authentication.newUser(userPostObject.getUsername(), userPostObject.getPassword());

        if (user != null) {
            return ResponseEntity.ok("success");
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/user/change_password")
    ResponseEntity<String> changePassword(HttpServletRequest request,
                                          @RequestBody PasswordChangePostObject passwordChangePostObject) {
        User user = webUtils.getUser(request);

        if (user != null) {
            if (authentication.changePassword(user.getUsername(), passwordChangePostObject.getPassword(),  passwordChangePostObject.getNewPassword())) {
                return ResponseEntity.ok("success");
            }

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/user/delete")
    ResponseEntity<String> delete(HttpServletRequest request,
                                  @RequestBody DeletePostObject deletePostObject) {
        User user = webUtils.getUser(request);
        if (user != null) {
            if (authentication.removeUser(user.getUsername(), deletePostObject.getPassword())) {
                ResponseEntity.ok("success");
            }

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.notFound().build();
    }
}
