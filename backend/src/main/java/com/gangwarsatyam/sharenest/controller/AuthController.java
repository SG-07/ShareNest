package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.AuthRequest;
import com.gangwarsatyam.sharenest.dto.AuthResponse;
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
        User user = authService.register(req.getUsername(), req.getPassword(),
                req.getUsername() + "@example.com", req.getUsername());
        String token = jwtProvider.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        authService.authenticate(req.getUsername(), req.getPassword());
        String token = jwtProvider.generateToken(req.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}