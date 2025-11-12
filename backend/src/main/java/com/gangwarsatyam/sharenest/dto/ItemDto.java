package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

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

    /**
     * condition sent as string from frontend (e.g. "good", "NEW", "Good").
     * We'll convert to ItemCondition in controller.
     */
    @NotBlank
    private String condition;

    // optional - if omitted we'll default to true when creating
    private Boolean available;

    // address pieces
    private String city;
    private String state;
    private String country;
    private String street;
    private String pincode;

    // coordinates (nullable; will map to 0.0 if null)
    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    /**
     * frontend will send image url (string) in "file" field (or full url).
     * We'll map this to Item.imageUrl.
     */
    private String file;
}
