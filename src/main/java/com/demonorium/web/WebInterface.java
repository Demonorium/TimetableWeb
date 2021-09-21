package com.demonorium.web;

import com.demonorium.database.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
@Controller
public class WebInterface {
    @Autowired
    WebUtils utils;

    @GetMapping("/")
    String home(HttpServletRequest request) {
        User user = utils.getUser(request);
        if (user != null) {
            return "index";
        } else {
            return "index-register";
        }

    }

}
