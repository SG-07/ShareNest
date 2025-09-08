package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.UserRegistrationDto;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public boolean existsById(String id) {
        return userRepository.existsById(id);
    }

    public void deleteById(String id) {
        userRepository.deleteById(id);
    }

    public User register(UserRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .roles(List.of("ROLE_USER"))  // Default role
                .build();

        return userRepository.save(user);
    }
}
