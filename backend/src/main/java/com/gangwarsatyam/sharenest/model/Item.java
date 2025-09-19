package com.gangwarsatyam.sharenest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    private String id;

    private String name;
    private String description;
    private int quantity;

    private String ownerId; // User ID of the item owner
    private String category;

    private ItemCondition condition; // ✅ enum reference

    private double latitude;
    private double longitude;

    private boolean available = true; // ✅ default available
    private String imageUrl;
}
