package com.demonorium;


import com.demonorium.config.MainConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Import;

import java.util.Locale;

@Import(MainConfig.class)
@EnableAutoConfiguration
public class Application {

    public static void main(String[] args) {
        Locale.setDefault(Locale.forLanguageTag("RU"));
        SpringApplication.run(Application.class);

    }
}
