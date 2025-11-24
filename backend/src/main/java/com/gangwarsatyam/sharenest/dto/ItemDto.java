package com.gangwarsatyam.sharenest.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.gangwarsatyam.sharenest.model.ItemCondition;
import jakarta.validation.constraints.*;
import lombok.*;
import com.gangwarsatyam.sharenest.model.UnavailableDateRange;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemDto {

    // ---------------------------------------------------------
    // BASIC FIELDS
    // ---------------------------------------------------------

    @NotBlank(message = "Item name is required.")
    private String name;

    @NotBlank(message = "Description is required.")
    private String description;

    @NotBlank(message = "Category is required.")
    private String category;

    @NotNull(message = "Item condition is required.")
    private ItemCondition condition;

    private Boolean available;


    // ---------------------------------------------------------
    // LOCATION
    // ---------------------------------------------------------

    private String city;
    private String state;
    private String country;
    private String street;

    @Pattern(regexp = "^[0-9]{5,6}$", message = "Invalid pincode.")
    private String pincode;


    // ---------------------------------------------------------
    // GEO COORDINATES
    // ---------------------------------------------------------

    @NotNull(message = "Latitude is required.")
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    private Double latitude;

    @NotNull(message = "Longitude is required.")
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
    private Double longitude;


    // ---------------------------------------------------------
    // MEDIA
    // ---------------------------------------------------------

    @Size(max = 10, message = "Maximum 10 images allowed.")
    private List<@NotBlank String> imageUrls;

    private List<@NotBlank String> tags;


    // ---------------------------------------------------------
    // RENTAL SETTINGS
    // ---------------------------------------------------------

    @PositiveOrZero(message = "Price per day must be ≥ 0.")
    private Double pricePerDay;

    @PositiveOrZero(message = "Security deposit must be ≥ 0.")
    private Double securityDeposit;

    @PositiveOrZero(message = "Delivery charge must be ≥ 0.")
    private Double deliveryCharge;

    @Positive(message = "Quantity must be greater than 0.")
    private Integer quantity;

    @Positive(message = "Min rental days must be > 0.")
    private Integer minRentalDays;

    @Positive(message = "Max rental days must be > 0.")
    private Integer maxRentalDays;

    private String deliveryOption;


    // ---------------------------------------------------------
    // UNAVAILABLE DATE RANGES  (NEW FIELD)
    // ---------------------------------------------------------


    private List<UnavailableDateRange> notAvailable;
}