package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.gangwarsatyam.sharenest.model.ItemCondition;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemDto {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotBlank
    private String category;

    // Correct: Enum, not string
    @NotNull
    private ItemCondition condition;

    private Boolean available;

    private String city;
    private String state;
    private String country;
    private String street;
    private String pincode;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    // Correct: frontend will send list of URLs
    private List<String> imageUrls;

    // Optional tags
    private List<String> tags;
}

