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
    @Id private String id;
    private String name;
    private String description;
    private String category;
    private String condition;   // e.g., NEW, GOOD, USED
    private String imageUrl;
    private boolean available = true;
    private double latitude;
    private double longitude;
    private String ownerId;   // reference to User._id
}