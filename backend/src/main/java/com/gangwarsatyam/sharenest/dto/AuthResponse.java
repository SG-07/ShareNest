package com.gangwarsatyam.sharenest.dto;

import  com.gangwarsatyam.sharenest.model.User;
import lombok.*;

import lombok.Data;

@Getter @Setter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private User user;
}
