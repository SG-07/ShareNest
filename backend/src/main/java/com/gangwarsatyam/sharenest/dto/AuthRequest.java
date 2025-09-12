package com.gangwarsatyam.sharenest.dto;

import lombok.*;

@Getter @Setter
public class AuthRequest {
    private String email;
    private String password;
    private String name;
    private String username;
}
