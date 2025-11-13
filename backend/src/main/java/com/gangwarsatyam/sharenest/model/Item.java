package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;


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
    private int quantity = 1;

    private String ownerId;
    private String category;
    private ItemCondition condition;

    private double latitude;
    private double longitude;

    private boolean available = true;

    private List<String> imageUrls;

    // address
    private String city;
    private String state;
    private String country;
    private String street;
    private String pincode;

    private List<String> tags;
    private int views = 0;
    private int likes = 0;

    private String borrowedBy; // userId if borrowed
    private Date borrowedTill;

    private Date createdAt;
    private Date updatedAt;
}