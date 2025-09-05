package com.example.library.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegistrationDto(
        @NotBlank(message = "Username must not be blank")
        @Size(min = 3, max = 20, message = "Username must be 3–20 characters")
        String username,

        @NotBlank(message = "Email must not be blank")
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Password must not be blank")
        @Size(min = 8, max = 50, message = "Password must be at least 8 characters")
        // 1 uppercase, 1 lowercase, 1 digit, 1 special char
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "Password must contain upper & lower case letters, digits, and special characters")
        String password
) {}