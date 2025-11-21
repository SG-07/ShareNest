package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    // ---- Rental Dates (String -> LocalDate in Service Layer) ----
    private String startDate;
    private String endDate;

    // ---- Rental Duration ----
    private int days;
    private int quantity;

    // ---- User Preferences ----
    private String deliveryOption; // pickup | delivery
    private String paymentMethod;  // online | cod

    // ---- Price Calculations ----
    private double securityDeposit;
    private double pricePerDay;
    private double subtotal;

    private double discount;
    private double tax;
    private double serviceFee;
    private double deliveryFee;

    private double totalPrice;

    // ---- Extra Details ----
    private String message;
    private List<String> imageUrls;
}
