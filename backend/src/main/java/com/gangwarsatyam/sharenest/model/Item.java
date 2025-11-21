package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    private String id;

    // ---------------------------------------------------------
    // BASIC DETAILS
    // ---------------------------------------------------------

    @Indexed
    private String name;

    private String description;

    @Indexed
    private String ownerId;

    @Indexed
    private String category;

    private ItemCondition condition;

    private boolean deleted = false;

    @Indexed
    private boolean available = true;

    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @Builder.Default
    private List<String> tags = new ArrayList<>();


    // ---------------------------------------------------------
    // LOCATION INFO
    // ---------------------------------------------------------

    private double latitude;
    private double longitude;

    @Indexed
    private String city;

    private String state;
    private String country;
    private String street;
    private String pincode;


    // ---------------------------------------------------------
    // RENTAL SETTINGS
    // ---------------------------------------------------------

    private double pricePerDay;
    private double securityDeposit;
    private double deliveryCharge;

    private int quantity;

    private LocalDate availableFrom;
    private LocalDate availableUntil;

    private int minRentalDays;
    private int maxRentalDays;

    // PICKUP | DELIVERY | BOTH
    private String deliveryOption;


    // ---------------------------------------------------------
    // STATS
    // ---------------------------------------------------------

    private int views = 0;
    private int likes = 0;


    // ---------------------------------------------------------
    // AUDIT FIELDS
    // ---------------------------------------------------------

    @CreatedDate
    @Field("createdAt")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updatedAt")
    private Instant updatedAt;


    // ---------------------------------------------------------
    // CUSTOM SETTERS TO AVOID NULL COLLECTIONS
    // ---------------------------------------------------------

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = (imageUrls != null) ? imageUrls : new ArrayList<>();
    }

    public void setTags(List<String> tags) {
        this.tags = (tags != null) ? tags : new ArrayList<>();
    }
}
