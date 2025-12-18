package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.UserRegistrationDto;
import com.gangwarsatyam.sharenest.exception.ServiceException;
import com.gangwarsatyam.sharenest.model.City;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Value("${app.debug:false}")
    private boolean debug;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ------------------------------
    // 🔐 Registration
    // ------------------------------

    /**
     * Centralized registration logic.
     * Ensures city is valid and supported.
     */
    public User register(UserRegistrationDto dto) {
        if (debug) {
            logger.debug(
                    "Registering new user with username: {}, email: {}, city: {}",
                    dto.getUsername(),
                    dto.getEmail(),
                    dto.getCity()
            );
        }

        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new ServiceException("Username is required", 400, "USERNAME_REQUIRED");
        }

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new ServiceException("Password is required", 400, "PASSWORD_REQUIRED");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new ServiceException("Email is required", 400, "EMAIL_REQUIRED");
        }

        if (dto.getCity() == null || dto.getCity().isBlank()) {
            throw new ServiceException("City is required", 400, "CITY_REQUIRED");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ServiceException("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ServiceException("Username already exists", 409, "USERNAME_ALREADY_EXISTS");
        }

        City city = parseCity(dto.getCity());

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .name(dto.getName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .city(city)
                .roles(List.of("ROLE_USER"))
                .lendCount(0)
                .borrowCount(0)
                .trustScore(0.0)
                .build();

        User savedUser = userRepository.save(user);

        if (debug) {
            logger.debug(
                    "User registered successfully with id: {}, city: {}",
                    savedUser.getId(),
                    savedUser.getCity()
            );
        }

        return savedUser;
    }

    /**
     * Validates and converts city string to enum.
     */
    private City parseCity(String city) {
        String normalized = city
                .trim()
                .toUpperCase()
                .replace(" ", "_");

        try {
            return City.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new ServiceException(
                    "Service not available in this city",
                    400,
                    "CITY_NOT_SUPPORTED"
            );
        }
    }

    // ------------------------------
    // 👥 User Queries
    // ------------------------------

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

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ServiceException(
                                "User not found: " + username,
                                404,
                                "USER_NOT_FOUND"
                        )
                );
    }

    // ------------------------------
    // 🚀 Trust / Lend / Borrow
    // ------------------------------

    public void increaseLendCount(String username) {
        User user = getUserByUsername(username);
        user.setLendCount(user.getLendCount() + 1);
        updateTrustScore(user);
        userRepository.save(user);

        if (debug) logger.debug("Lend count increased for user: {}", username);
    }

    public void increaseBorrowCount(String username) {
        User user = getUserByUsername(username);
        user.setBorrowCount(user.getBorrowCount() + 1);
        updateTrustScore(user);
        userRepository.save(user);

        if (debug) logger.debug("Borrow count increased for user: {}", username);
    }

    private void updateTrustScore(User user) {
        double score = (user.getLendCount() + user.getBorrowCount()) * 0.5;
        user.setTrustScore(score);

        if (debug) {
            logger.debug(
                    "Trust score updated for {}: {}",
                    user.getUsername(),
                    score
            );
        }
    }
}
