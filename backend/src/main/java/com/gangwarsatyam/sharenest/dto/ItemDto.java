package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank
    private String condition;

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

    // ✅ frontend can send list of image URLs
    private List<String> files;

    // ✅ optional tags
    private List<String> tags;
}
