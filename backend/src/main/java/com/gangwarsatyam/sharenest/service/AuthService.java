package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.exception.ServiceException;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import com.gangwarsatyam.sharenest.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public User register(String username, String password, String email, String name) {
        if (userRepository.existsByEmail(email)) {
            throw new ServiceException("Email already registered", 409, "EMAIL_ALREADY_EXISTS");
        }

        if (userRepository.existsByUsername(username)) {
            throw new ServiceException("Username already exists", 409, "USERNAME_ALREADY_EXISTS");
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .name(name)
                .roles(List.of("ROLE_USER"))
                .build();

        return userRepository.save(user);
    }

    public String authenticateAndGetToken(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(
                        "User not found with username: " + username,
                        404,
                        "USER_NOT_FOUND"
                ));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        return jwtProvider.generateToken(username);
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(
                        "User not found with username: " + username,
                        404,
                        "USER_NOT_FOUND"
                ));
    }
}