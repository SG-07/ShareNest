package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.ItemDto;
import com.gangwarsatyam.sharenest.dto.ItemResponse;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);
    private final ItemRepository itemRepo;
    private final UserRepository userRepo;
    private final CloudinaryService cloudinaryService;

    public List<ItemResponse> getAllItems() {
        logger.debug("Fetching all items from DB");
        return itemRepo.findAll().stream().map(this::toResponse).toList();
    }

    public ItemResponse getItemById(String id) {
        Item item = itemRepo.findById(id).orElseThrow(() -> new RuntimeException("Item not found"));
        logger.debug("Fetched item {}", id);
        return toResponse(item);
    }

    public ItemResponse addItem(ItemDto dto, MultipartFile image, User owner) throws IOException {
        String imageUrl = cloudinaryService.uploadImage(image.getBytes(), "sharenest/items");
        Item item = Item.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .condition(dto.getCondition())
                .imageUrl(imageUrl)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .ownerId(owner.getId().toString())
                .build();
        Item saved = itemRepo.save(item);
        logger.info("New item added by {}: {}", owner.getUsername(), saved.getName());
        return toResponse(saved);
    }

    public void makeAvailable(String itemId) {
        Item item = itemRepo.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));
        item.setAvailable(true);
        itemRepo.save(item);
        logger.debug("Item {} set to available", itemId);
    }

    private ItemResponse toResponse(Item item) {
        return new ItemResponse(
                item.getId(), item.getName(), item.getDescription(),
                item.getCategory(), item.getCondition(),
                item.getImageUrl(), item.isAvailable(),
                item.getLatitude(), item.getLongitude(),
                item.getOwnerId()
        );
    }
}