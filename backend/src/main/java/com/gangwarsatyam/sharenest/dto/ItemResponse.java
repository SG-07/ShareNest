package com.gangwarsatyam.sharenest.dto;

import com.gangwarsatyam.sharenest.model.Item;
import lombok.*;

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
    private String condition;
    private String imageUrl;
    private boolean available;
    private double latitude;
    private double longitude;
    private String ownerId;

    // ✅ Convert Item -> ItemResponse
    public static ItemResponse fromEntity(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .condition(item.getCondition() != null ? item.getCondition().name() : null)
                .imageUrl(item.getImageUrl())
                .available(item.isAvailable())
                .latitude(item.getLatitude())
                .longitude(item.getLongitude())
                .ownerId(item.getOwnerId())
                .build();
    }
}
