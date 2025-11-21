package com.gangwarsatyam.sharenest.dto;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.ItemCondition;
import lombok.*;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ItemResponse {

    private String id;
    private String name;
    private String description;
    private String category;
    private ItemCondition condition;

    private List<String> imageUrls;
    private boolean available;
    private double latitude;
    private double longitude;

    private String ownerId;
    private List<String> tags;

    private int views;
    private int likes;

    private Instant createdAt;
    private Instant updatedAt;

    // ---- NEW FIELDS (LOCATION) ----
    private String city;
    private String state;
    private String country;
    private String street;
    private String pincode;

    // ---- NEW FIELDS (RENTAL INFO) ----
    private Double pricePerDay;
    private Double securityDeposit;
    private Double deliveryCharge;

    private Integer quantity;

    private LocalDate availableFrom;
    private LocalDate availableUntil;

    private Integer minRentalDays;
    private Integer maxRentalDays;

    private String deliveryOption;

    public static ItemResponse fromEntity(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .condition(item.getCondition())
                .imageUrls(item.getImageUrls())
                .available(item.isAvailable())
                .latitude(item.getLatitude())
                .longitude(item.getLongitude())
                .ownerId(item.getOwnerId())
                .tags(item.getTags())
                .views(item.getViews())
                .likes(item.getLikes())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())

                // LOCATION
                .city(item.getCity())
                .state(item.getState())
                .country(item.getCountry())
                .street(item.getStreet())
                .pincode(item.getPincode())

                // RENTAL INFO
                .pricePerDay(item.getPricePerDay())
                .securityDeposit(item.getSecurityDeposit())
                .deliveryCharge(item.getDeliveryCharge())
                .quantity(item.getQuantity())
                .availableFrom(item.getAvailableFrom())
                .availableUntil(item.getAvailableUntil())
                .minRentalDays(item.getMinRentalDays())
                .maxRentalDays(item.getMaxRentalDays())

                .deliveryOption(item.getDeliveryOption())

                .build();
    }
}
