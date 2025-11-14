package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import com.gangwarsatyam.sharenest.model.ItemCondition;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;
import java.util.Date;

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

    // 🔥 CORRECT FIELD
    private List<String> imageUrls;

    private List<String> tags;
}
