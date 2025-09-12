package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.dto.AuthRequest;
import com.gangwarsatyam.sharenest.dto.AuthResponse;
import com.gangwarsatyam.sharenest.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody AuthRequest req) {
        User user = authService.register(
                req.getUsername(),
                req.getPassword(),
                req.getEmail(),
                req.getName()
        );

        String token = authService.authenticateAndGetToken(req.getUsername(), req.getPassword());
        logger.debug("[AuthController][Signup] Token generated: {}", token);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        String identifier = req.getUsername() != null ? req.getUsername() : req.getEmail();
        logger.debug("[AuthController][Login] Received identifier: {}", identifier);

        String token = authService.authenticateAndGetToken(identifier, req.getPassword());
        logger.debug("[AuthController][Login] Token generated: {}", token);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@RequestParam String username) {
        boolean available = authService.isUsernameAvailable(username);
        return ResponseEntity.ok(Map.of("available", available));
    }
}
