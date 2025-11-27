package com.gangwarsatyam.sharenest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReceivedRequestResponse {

    private String id;

    private ItemSummary item;
    private BorrowerSummary borrower;

    private String requestedFrom;
    private String requestedTill;
    private LocalDateTime createdAt;

    private String deliveryOption;
    private int quantity;
    private String paymentMethod;
    private String message;

    private Pricing pricing;

    private String status;

    // --------------------------------------
    @Data
    @AllArgsConstructor
    public static class ItemSummary {
        private String id;
        private String name;
        private String image;
        private double securityDeposit;
    }

    // --------------------------------------
    @Data
    @AllArgsConstructor
    public static class BorrowerSummary {
        private String id;
        private String name;
        private double trustScore;
        private int borrowCount;
    }

    // --------------------------------------
    @Data
    @AllArgsConstructor
    public static class Pricing {
        private double pricePerDay;
        private double totalPrice;
    }
}
