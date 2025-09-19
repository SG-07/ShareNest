package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.AuthResponse;
import com.gangwarsatyam.sharenest.dto.UserDto;
import com.gangwarsatyam.sharenest.dto.UserRegistrationDto;
import com.gangwarsatyam.sharenest.exception.BadRequestException;
import com.gangwarsatyam.sharenest.exception.UnauthorizedException;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse signup(UserRegistrationDto dto) {
        // Check username/email uniqueness
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (dto.getEmail() != null && userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail()); // optional, can be null
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getName());
        user.setRoles(Collections.singletonList("ROLE_USER"));

        userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user);

        // Map to safe DTO
        UserDto userDto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getTrustScore()
        );

        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(String username, String password) {
        // ✅ Fetch user by ONLY username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Validate password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);

        // Map to safe DTO
        UserDto userDto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getTrustScore()
        );

        return new AuthResponse(token, userDto);
    }
}


