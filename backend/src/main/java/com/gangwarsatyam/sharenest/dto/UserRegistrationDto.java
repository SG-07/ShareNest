package com.gangwarsatyam.sharenest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDto {
    private String username;   // Now explicitly required
    private String email;
    private String password;
    private String name;
}
