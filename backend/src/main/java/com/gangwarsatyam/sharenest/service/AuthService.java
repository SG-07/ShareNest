package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.UserDto;
import com.gangwarsatyam.sharenest.dto.UserRegistrationDto;
import com.gangwarsatyam.sharenest.dto.AuthResponse;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import com.gangwarsatyam.sharenest.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthResponse signup(UserRegistrationDto dto) {
        log.debug("[AuthService] Signup attempt for username: {}", dto.getUsername());

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .email(dto.getEmail())
                .name(dto.getName())
                .roles(Collections.singletonList("ROLE_USER"))
                .build();

        userRepository.save(user);

        String token = jwtProvider.generateToken(user.getUsername());
        log.debug("[AuthService] Token generated: {}", token);

        return new AuthResponse(token, mapToDto(user));
    }

    public AuthResponse login(String username, String password) {
        log.debug("[AuthService] Login attempt for username/email: {}", username);

        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new RuntimeException("Invalid username or email"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtProvider.generateToken(user.getUsername());
        log.debug("[AuthService] Token generated: {}", token);

        return new AuthResponse(token, mapToDto(user));
    }

    private UserDto mapToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getTrustScore(),
                user.getRoles()
        );
    }
}
