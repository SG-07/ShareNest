package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

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
    private int quantity = 1; // keep default if needed

    private String ownerId; // User ID of the item owner
    private String category;

    private ItemCondition condition; // enum

    private double latitude;
    private double longitude;

    private boolean available = true;
    private List<String> imageUrls;

    // Address fields
    private String city;
    private String state;
    private String country;
    private String street;
    private String pincode;
}
