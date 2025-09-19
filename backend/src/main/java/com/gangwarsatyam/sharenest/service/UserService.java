package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.UserRegistrationDto;
import com.gangwarsatyam.sharenest.exception.ServiceException;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Value("${app.debug:false}")
    private boolean debug;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Inject PasswordEncoder (defined as BCryptPasswordEncoder bean in SecurityConfig)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public java.util.List<User> findAllUsers() {
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

    /**
     * Centralized registration logic. Throws ServiceException for client-friendly errors.
     */
    public User register(UserRegistrationDto dto) {
        if (debug) logger.debug("Registering new user with username: {} and email: {}", dto.getUsername(), dto.getEmail());

        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new ServiceException("Username is required", 400, "USERNAME_REQUIRED");
        }

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new ServiceException("Password is required", 400, "PASSWORD_REQUIRED");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new ServiceException("Email is required", 400, "EMAIL_REQUIRED");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ServiceException("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ServiceException("Username already exists", 409, "USERNAME_ALREADY_EXISTS");
        }

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .name(dto.getName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .roles(List.of("ROLE_USER"))
                .build();

        User savedUser = userRepository.save(user);

        if (debug) logger.debug("User registered successfully with id: {}", savedUser.getId());

        return savedUser;
    }
}
