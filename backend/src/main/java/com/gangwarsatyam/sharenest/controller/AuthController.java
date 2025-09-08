package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.dto.AuthRequest;
import com.gangwarsatyam.sharenest.dto.AuthResponse;
import com.gangwarsatyam.sharenest.security.JwtProvider;
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
    private final JwtProvider jwtProvider;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody AuthRequest req) {
        User user = authService.register(
                req.getEmail().split("@")[0],   // Generate username from email prefix
                req.getPassword(),
                req.getEmail(),
                req.getEmail().split("@")[0]
        );

        String token = jwtProvider.generateToken(user.getEmail());  // Generate token using email
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        authService.authenticate(req.getEmail(), req.getPassword());
        String token = jwtProvider.generateToken(req.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}