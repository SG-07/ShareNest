package com.example.library.controller;

import com.example.library.entity.User;
import com.example.library.exception.BadRequestException;
import com.example.library.service.UserService;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> listAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userService.existsById(id)) {
            throw new BadRequestException("User not found");
        }
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // similar endpoints for books, categories, etc. …
}