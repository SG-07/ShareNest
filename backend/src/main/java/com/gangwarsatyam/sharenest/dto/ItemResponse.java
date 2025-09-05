package com.gangwarsatyam.sharenest.dto;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
public class ItemResponse {
    private String id;
    private String name;
    private String description;
    private String category;
    private String condition;
    private String imageUrl;
    private boolean available;
    private double latitude;
    private double longitude;
    private String ownerId;
}