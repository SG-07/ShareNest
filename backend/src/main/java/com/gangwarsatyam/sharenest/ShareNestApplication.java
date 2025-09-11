package com.gangwarsatyam.sharenest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.gangwarsatyam.sharenest")
public class ShareNestApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShareNestApplication.class, args);
    }
}