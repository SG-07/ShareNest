package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.UserRegistrationDto;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Value("${app.debug}")
    private boolean debug;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public List<User> findAllUsers() {
        if (debug) logger.debug("Fetching all users");
        return userRepository.findAll();
    }

    public boolean existsById(String id) {
        if (debug) logger.debug("Checking existence of user by id: {}", id);
        return userRepository.existsById(id);
    }

    public void deleteById(String id) {
        if (debug) logger.debug("Deleting user with id: {}", id);
        userRepository.deleteById(id);
    }

    public User register(UserRegistrationDto dto) {
        if (debug) logger.debug("Registering new user with username: {} and email: {}", dto.getUsername(), dto.getEmail());

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(dto.getUsername())  // Use explicitly provided username
                .email(dto.getEmail())
                .name(dto.getName())          // Store the user's name too
                .password(passwordEncoder.encode(dto.getPassword()))
                .roles(List.of("ROLE_USER"))  // Default role
                .build();

        User savedUser = userRepository.save(user);

        if (debug) logger.debug("User registered successfully with id: {}", savedUser.getId());

        return savedUser;
    }
}
