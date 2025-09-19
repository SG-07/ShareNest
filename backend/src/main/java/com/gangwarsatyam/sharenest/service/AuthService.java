package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.exception.ServiceException;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import com.gangwarsatyam.sharenest.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

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

        User savedUser = userRepository.save(user);
        logger.debug("[AuthService][Register] New user registered: {}", savedUser.getUsername());

        return savedUser;
    }

    public User authenticateByUsername(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServiceException(
                        "User not found with username: " + username,
                        404,
                        "USER_NOT_FOUND"
                ));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password)
        );

        logger.debug("[AuthService][AuthenticateByUsername] User authenticated: {}", user.getUsername());
        return user;
    }

    public User authenticateByEmail(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException(
                        "User not found with email: " + email,
                        404,
                        "USER_NOT_FOUND"
                ));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password)
        );

        logger.debug("[AuthService][AuthenticateByEmail] User authenticated: {}", user.getUsername());
        return user;
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }
}
