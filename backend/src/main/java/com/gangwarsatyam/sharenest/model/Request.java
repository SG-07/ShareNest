package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.time.LocalDate;

@Document(collection = "requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {

    @Id
    private String id;

    private String itemId;
    private String borrowerId;
    private String ownerId;

    /**
     * Default: PENDING
     * Other values: APPROVED, REJECTED, CANCELLED, COMPLETED
     */
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Builder.Default
    private long requestDate = System.currentTimeMillis();

    // Rental dates (should NOT be Strings)
    private LocalDate startDate;
    private LocalDate endDate;

    private int days;
    private int quantity;

    /**
     * pickup | delivery
     */
    private String deliveryOption;

    /**
     * online | cod
     */
    private String paymentMethod;

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

