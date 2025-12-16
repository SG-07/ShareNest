package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.config.AppProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    private final AppProperties appProperties;

    public HomeController(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @GetMapping("/")
    public ResponseEntity<Void> redirectToFrontend() {
        return ResponseEntity
                .status(302)
                .header("Location", appProperties.getFrontendUrl())
                .build();
    }
}
