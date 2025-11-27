package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Builder.Default
    private long requestDate = System.currentTimeMillis();

    // --------------------------------------------------------
    // RENTAL DETAILS
    // --------------------------------------------------------
    private LocalDate startDate;
    private LocalDate endDate;

    @CreatedDate
    private LocalDateTime createdAt;

    private int days;
    private int quantity;

    // --------------------------------------------------------
    // DELIVERY OPTIONS
    // --------------------------------------------------------
    private String deliveryOption;
    private double deliveryFee;

    // --------------------------------------------------------
    // PAYMENT INFORMATION
    // --------------------------------------------------------
    private String paymentMethod;

    private double pricePerDay;
    private double securityDeposit;

    private double subtotal;
    private double discount;
    private double tax;
    private double serviceFee;

    private double totalPrice;

    // --------------------------------------------------------
    // ADDITIONAL INFO
    // --------------------------------------------------------
    private String message;
    private List<String> imageUrls;
}
