package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.ItemDto;
import com.gangwarsatyam.sharenest.exception.BadRequestException;
import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.ItemCondition;
import com.gangwarsatyam.sharenest.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
    private final ItemService itemService;

    // ✅ Create - accepts ItemDto JSON
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Item> addItem(@Valid @RequestBody ItemDto dto, Authentication auth) {
        if (auth == null) {
            throw new BadRequestException("Authentication is required to add an item.");
        }

        String username = auth.getName();
        logger.debug("[ItemController] Add item request by '{}': {}", username, dto);

        Item item = mapDtoToItem(dto);
        Item saved = itemService.addItem(item, username);
        return ResponseEntity.ok(saved);
    }

    // ✅ Read all available items
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Item>> getAllAvailableItems() {
        logger.debug("[ItemController] Fetching all available items");
        return ResponseEntity.ok(itemService.getAllAvailableItems());
    }

    // ✅ Read single item by ID
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        logger.debug("[ItemController] Fetching item with id: {}", id);
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    // ✅ Update (owner only)
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Item> updateItem(
            @PathVariable String id,
            @Valid @RequestBody ItemDto dto,
            Authentication auth) {

        if (auth == null) {
            throw new BadRequestException("Authentication is required to update an item.");
        }

        String username = auth.getName();
        logger.debug("[ItemController] Update item {} by user: {} payload: {}", id, username, dto);

        Item updatedItem = mapDtoToItem(dto);
        Item saved = itemService.updateItem(id, updatedItem, username);
        return ResponseEntity.ok(saved);
    }

    // ✅ Delete (owner only)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable String id, Authentication auth) {
        if (auth == null) {
            throw new BadRequestException("Authentication is required to delete an item.");
        }

        String username = auth.getName();
        logger.debug("[ItemController] Delete item {} request by user: {}", id, username);

        itemService.deleteItem(id, username);
        return ResponseEntity.ok("Item deleted successfully");
    }

    // ✅ Get logged-in user's items
    @GetMapping(value = "/my", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Item>> getMyItems(Authentication auth) {
        if (auth == null) {
            throw new BadRequestException("Authentication is required to fetch user's items.");
        }

        String username = auth.getName();
        logger.debug("[ItemController] Fetch my items for user: {}", username);
        return ResponseEntity.ok(itemService.getMyItems(username));
    }

    // ✅ Get logged-in user's available items
    @GetMapping(value = "/my/available", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Item>> getMyAvailableItems(Authentication auth) {
        if (auth == null) {
            throw new BadRequestException("Authentication is required to fetch user's available items.");
        }

        String username = auth.getName();
        logger.debug("[ItemController] Fetch my available items for user: {}", username);
        return ResponseEntity.ok(itemService.getMyAvailableItems(username));
    }

    // ✅ Helper: map DTO -> Entity
    private Item mapDtoToItem(ItemDto dto) {
        Item item = new Item();

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setCategory(dto.getCategory());

        try {
            if (dto.getCondition() != null) {
                item.setCondition(ItemCondition.valueOf(dto.getCondition().trim().toUpperCase()));
            }
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid condition value: " + dto.getCondition());
        }

        item.setLatitude(dto.getLatitude() != null ? dto.getLatitude() : 0.0);
        item.setLongitude(dto.getLongitude() != null ? dto.getLongitude() : 0.0);
        item.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);

        item.setImageUrls(dto.getFiles());
        item.setTags(dto.getTags());

        item.setCity(dto.getCity());
        item.setState(dto.getState());
        item.setCountry(dto.getCountry());
        item.setStreet(dto.getStreet());
        item.setPincode(dto.getPincode());

        return item;
    }

}
