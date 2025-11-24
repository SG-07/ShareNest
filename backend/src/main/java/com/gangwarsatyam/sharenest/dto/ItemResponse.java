package com.gangwarsatyam.sharenest.dto;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.UnavailableDateRange;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
public class ItemResponse {

    private String id;

    private String name;
    private String description;
    private String ownerId;
    private String category;

    private boolean available;
    private boolean deleted;

    private List<String> imageUrls;
    private List<String> tags;

    private double latitude;
    private double longitude;

    private String city;
    private String state;
    private String country;
    private String street;
    private String pincode;

    private double pricePerDay;
    private double securityDeposit;
    private double deliveryCharge;

    private int quantity;

    private LocalDate availableFrom;

    private int minRentalDays;
    private int maxRentalDays;

    private String deliveryOption;

    private int views;
    private int likes;

    private Instant createdAt;
    private Instant updatedAt;

    // Updated field name
    private List<UnavailableDateRange> unavailableDateRanges;


    // ==========================================================
    // MAPPER: Convert Item → ItemResponse
    // ==========================================================
    public static ItemResponse fromItem(Item item) {
        ItemResponse dto = new ItemResponse();

        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setOwnerId(item.getOwnerId());
        dto.setCategory(item.getCategory());

        dto.setAvailable(item.isAvailable());
        dto.setDeleted(item.isDeleted());

        dto.setImageUrls(item.getImageUrls());
        dto.setTags(item.getTags());

        dto.setLatitude(item.getLatitude());
        dto.setLongitude(item.getLongitude());

        dto.setCity(item.getCity());
        dto.setState(item.getState());
        dto.setCountry(item.getCountry());
        dto.setStreet(item.getStreet());
        dto.setPincode(item.getPincode());

        dto.setPricePerDay(item.getPricePerDay());
        dto.setSecurityDeposit(item.getSecurityDeposit());
        dto.setDeliveryCharge(item.getDeliveryCharge());

        dto.setQuantity(item.getQuantity());

        dto.setAvailableFrom(item.getAvailableFrom());

        dto.setMinRentalDays(item.getMinRentalDays());
        dto.setMaxRentalDays(item.getMaxRentalDays());

        dto.setDeliveryOption(item.getDeliveryOption());

        dto.setViews(item.getViews());
        dto.setLikes(item.getLikes());

        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());

        dto.setUnavailableDateRanges(item.getNotAvailable());

        return dto;
    }

    public static ItemResponse fromEntity(Item item) {
        return fromItem(item);
    }
}
