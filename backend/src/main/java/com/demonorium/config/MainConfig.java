package com.demonorium.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ComponentScan("com.demonorium.database")
@Import({WebConfig.class})
public class MainConfig {
}
