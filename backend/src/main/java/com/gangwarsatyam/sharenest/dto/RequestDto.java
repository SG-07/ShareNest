package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestDto {

    // ---- Required ----
    @NotBlank(message = "Item ID must not be empty")
    private String itemId;

    // ---- Rental Dates (sent as string, parsed in backend) ----
    @NotBlank(message = "Start date is required")
    private String startDate;

    @NotBlank(message = "End date is required")
    private String endDate;

    // ---- Rental Duration ----
    @Positive(message = "Rental days must be greater than 0")
    private int days;

    @Positive(message = "Quantity must be greater than 0")
    private int quantity;

    // ---- Pricing ----
    @Positive(message = "Security deposit must be greater than 0")
    private int securityDeposit;

    // ---- User Preferences ----
    private String deliveryOption; // pickup | delivery
    private String paymentMethod;  // online | cod

    // ---- Extra Details (Optional) ----
    private String message;
    private List<String> imageUrls;
}
