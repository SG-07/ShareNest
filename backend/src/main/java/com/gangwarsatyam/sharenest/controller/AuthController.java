package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.dto.AuthRequest;
import com.gangwarsatyam.sharenest.dto.AuthResponse;
import com.gangwarsatyam.sharenest.exception.ServiceException;
import com.gangwarsatyam.sharenest.service.AuthService;
import com.gangwarsatyam.sharenest.security.JwtProvider;
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
    private final JwtProvider jwtProvider;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody AuthRequest req) {
        User user = authService.register(
                req.getUsername(),
                req.getPassword(),
                req.getEmail(),
                req.getName()
        );

        String token = jwtProvider.generateToken(user.getUsername());  // Generate token directly
        logger.debug("[AuthController][Signup] Token generated: {}", token);

        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        if ((req.getUsername() == null || req.getUsername().isEmpty()) &&
                (req.getEmail() == null || req.getEmail().isEmpty())) {
            throw new ServiceException("Username or email must be provided", 400, "IDENTIFIER_MISSING");
        }

        String token;
        User user;

        if (req.getUsername() != null && !req.getUsername().isEmpty()) {
            user = authService.authenticateByUsername(req.getUsername(), req.getPassword());
        } else {
            user = authService.authenticateByEmail(req.getEmail(), req.getPassword());
        }

        token = jwtProvider.generateToken(user.getUsername());
        logger.debug("[AuthController][Login] Token generated: {}", token);

        return ResponseEntity.ok(new AuthResponse(token, user));  // Send back token + user info
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@RequestParam String username) {
        boolean available = authService.isUsernameAvailable(username);
        return ResponseEntity.ok(Map.of("available", available));
    }
}
