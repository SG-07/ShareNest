package com.gangwarsatyam.sharenest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class UserDto {
    private String id;
    private String username;
    private String email;
    private String name;
    private double trustScore;
    private List<String> roles;
}