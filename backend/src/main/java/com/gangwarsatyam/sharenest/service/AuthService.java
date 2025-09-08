package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.exception.ServiceException;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
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

    public User register(String username, String password, String email, String name) {
        if (userRepository.existsByEmail(email)) {
            throw new ServiceException(
                    "Email already registered",
                    409,
                    "EMAIL_ALREADY_EXISTS"
            );
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

    public void authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException(
                        "User not found with email: " + email,
                        404,
                        "USER_NOT_FOUND"
                ));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), password)
        );
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException(
                        "User not found with email: " + email,
                        404,
                        "USER_NOT_FOUND"
                ));
    }
}
