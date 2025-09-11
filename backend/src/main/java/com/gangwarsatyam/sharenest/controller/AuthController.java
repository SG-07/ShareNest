package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.dto.AuthRequest;
import com.gangwarsatyam.sharenest.dto.AuthResponse;
import java.util.Map;
import com.gangwarsatyam.sharenest.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody AuthRequest req) {
        User user = authService.register(
                req.getUsername(),    // Explicit username from frontend
                req.getPassword(),
                req.getEmail(),
                req.getName()
        );

        String token = authService.authenticateAndGetToken(user.getUsername(), req.getPassword());

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        String token = authService.authenticateAndGetToken(req.getUsername(), req.getPassword());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsernameAvailability(@RequestParam String username) {
        boolean available = authService.isUsernameAvailable(username);
        return ResponseEntity.ok(Map.of("available", available));
    }
}