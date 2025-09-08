package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.UserRegistrationDto;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRegistrationDto dto) {
        User user = userService.register(dto);
        return ResponseEntity.ok(user);
    }
}
