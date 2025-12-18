package com.gangwarsatyam.sharenest.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegistrationDto {
    private String username;
    private String password;
    private String email;
    private String name;
    @NotBlank
    private String city;
}
