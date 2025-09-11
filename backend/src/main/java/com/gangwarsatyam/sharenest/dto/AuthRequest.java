package com.gangwarsatyam.sharenest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    private String username;  // Changed from email to username for login/signup
    private String password;
    private String email;     // Required for signup
    private String name;      // Required for signup
}