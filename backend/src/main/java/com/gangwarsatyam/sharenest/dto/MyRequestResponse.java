package com.gangwarsatyam.sharenest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyRequestResponse {

    private String id;

    // ---- Item Summary ----
    private ItemSummary item;

    private String requestedFrom;
    private String requestedTill;

    private String status;
    private String deliveryOption;
    private int quantity;
    private String paymentMethod;
    private String message;

    private double pricePerDay;
    private double securityDeposit;
    private double deliveryFee;
    private double subtotal;
    private double discount;
    private double tax;
    private double serviceFee;
    private double totalPrice;
    private int days;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemSummary {
        private String id;
        private String name;
        private String image;
        private double pricePerDay;
        private double securityDeposit;
    }
}
