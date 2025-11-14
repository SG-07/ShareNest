package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.ItemDto;
import com.gangwarsatyam.sharenest.dto.ItemResponse;
import com.gangwarsatyam.sharenest.exception.BadRequestException;
import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
    private final ItemService itemService;

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ItemResponse> addItem(@Valid @RequestBody ItemDto dto, Authentication auth) {

        if (auth == null) {
            throw new BadRequestException("Authentication is required to add an item.");
        }

        String username = auth.getName();
        logger.debug("[ItemController] Add item request by '{}': {}", username, dto);

        Item item = mapDtoToItem(dto);
        Item saved = itemService.addItem(item, username);

        return ResponseEntity.ok(ItemResponse.fromEntity(saved));
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ItemResponse>> getAllAvailableItems() {

        List<Item> list = itemService.getAllAvailableItems();
        List<ItemResponse> responses = list.stream().map(ItemResponse::fromEntity).toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ItemResponse> getItemById(@PathVariable String id) {
        Item item = itemService.getItemById(id);
        return ResponseEntity.ok(ItemResponse.fromEntity(item));
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable String id,
            @Valid @RequestBody ItemDto dto,
            Authentication auth) {

        if (auth == null) {
            throw new BadRequestException("Authentication is required to update an item.");
        }

        String username = auth.getName();
        logger.debug("[ItemController] Update item {} by user '{}': {}", id, username, dto);

        Item updatedItem = mapDtoToItem(dto);
        Item saved = itemService.updateItem(id, updatedItem, username);

        return ResponseEntity.ok(ItemResponse.fromEntity(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable String id, Authentication auth) {

        if (auth == null) {
            throw new BadRequestException("Authentication is required to delete an item.");
        }

        String username = auth.getName();
        itemService.deleteItem(id, username);

        return ResponseEntity.ok("Item deleted successfully");
    }

    @GetMapping("/my")
    public ResponseEntity<List<ItemResponse>> getMyItems(Authentication auth) {

        String username = auth.getName();
        List<Item> items = itemService.getMyItems(username);

        return ResponseEntity.ok(
                items.stream().map(ItemResponse::fromEntity).toList()
        );
    }

    @GetMapping("/my/available")
    public ResponseEntity<List<ItemResponse>> getMyAvailableItems(Authentication auth) {

        String username = auth.getName();
        List<Item> items = itemService.getMyAvailableItems(username);

        return ResponseEntity.ok(
                items.stream().map(ItemResponse::fromEntity).toList()
        );
    }

    private Item mapDtoToItem(ItemDto dto) {
        Item item = new Item();

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setCategory(dto.getCategory());
        item.setCondition(dto.getCondition());

        item.setLatitude(dto.getLatitude());
        item.setLongitude(dto.getLongitude());
        item.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);

        item.setImageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : new ArrayList<>());
        item.setTags(dto.getTags() != null ? dto.getTags() : new ArrayList<>());

        item.setCity(dto.getCity());
        item.setState(dto.getState());
        item.setCountry(dto.getCountry());
        item.setStreet(dto.getStreet());
        item.setPincode(dto.getPincode());

        return item;
    }
}
