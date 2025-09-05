package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
public class ItemDto {
    @NotBlank private String name;
    @NotBlank private String description;
    @NotBlank private String category;
    @NotBlank private String condition;
    @NotNull private Double latitude;
    @NotNull private Double longitude;
}