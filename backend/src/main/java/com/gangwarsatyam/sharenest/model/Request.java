package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
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

    private String itemId;      // Item being requested
    private String borrowerId;  // Who is requesting
    private String ownerId;     // Owner of the item

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Builder.Default
    private long requestDate = System.currentTimeMillis();

    // --------------------------------------------------------
    // RENTAL DETAILS (for owner to approve)
    // --------------------------------------------------------
    private LocalDate startDate;
    private LocalDate endDate;

    private int days;
    private int quantity;

    // --------------------------------------------------------
    // DELIVERY OPTIONS
    // --------------------------------------------------------
    private String deliveryOption;   // pickup | delivery
    private double deliveryFee;

    // --------------------------------------------------------
    // PAYMENT INFORMATION
    // --------------------------------------------------------
    private String paymentMethod;     // online | cod

    private double pricePerDay;
    private double securityDeposit;

    private double subtotal;          // (pricePerDay * days * quantity)
    private double discount;
    private double tax;
    private double serviceFee;

    private double totalPrice;        // final payable amount

    // --------------------------------------------------------
    // ADDITIONAL INFO
    // --------------------------------------------------------
    private String message;           // note from borrower
    private List<String> imageUrls;   // screenshots if any
}
