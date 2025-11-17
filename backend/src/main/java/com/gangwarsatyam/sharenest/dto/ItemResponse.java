package com.gangwarsatyam.sharenest.dto;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.ItemCondition;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemResponse {

    private String id;
    private String name;
    private String description;
    private String category;
    private ItemCondition condition;   // Enum, not string
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

    public static ItemResponse fromEntity(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .condition(item.getCondition())        // correct
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
                .build();
    }
}
