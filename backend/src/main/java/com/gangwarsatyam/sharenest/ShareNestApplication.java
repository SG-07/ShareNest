package com.gangwarsatyam.sharenest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.gangwarsatyam.sharenest.config.AppProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class ShareNestApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShareNestApplication.class, args);
    }
}