package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.gangwarsatyam.sharenest.model.ItemCondition;

import java.time.LocalDate;
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

    private List<String> imageUrls;

    private List<String> tags;

    // -----------------------------
    // NEW FIELDS USED IN CONTROLLER
    // -----------------------------

    private Double pricePerDay;
    private Double securityDeposit;
    private Double deliveryCharge;

    private Integer quantity;

    private LocalDate availableFrom;
    private LocalDate availableUntil;

    private Integer minRentalDays;
    private Integer maxRentalDays;

    private String ownerId;
    private String deliveryOption;
}
