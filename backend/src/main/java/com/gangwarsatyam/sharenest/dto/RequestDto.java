package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestDto {

    @NotBlank
    private String itemId;

    private String startDate;
    private String endDate;

    private int days;
    private int quantity;

    private String deliveryOption; // "pickup" | "delivery"
    private String paymentMethod;  // "online" | "cod"

    private double securityDeposit;
    private double pricePerDay;
    private double subtotal;

    private double discount;
    private double tax;
    private double serviceFee;
    private double deliveryFee;

    private double totalPrice;

    private String message;
    private List<String> imageUrls;
}
