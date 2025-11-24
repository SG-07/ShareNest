package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.ItemDto;
import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.dto.RequestDto;
import com.gangwarsatyam.sharenest.dto.ItemResponse;
import com.gangwarsatyam.sharenest.exception.BadRequestException;
import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);

    private final ItemService itemService;

    @Value("${app.debug:false}")
    private boolean debug;

    // ----------------------------------------------------
    // ADD ITEM
    // ----------------------------------------------------
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ItemResponse> addItem(
            @Valid @RequestBody ItemDto dto,
            Authentication auth
    ) {
        String username = extractUsername(auth);

        if (debug) logger.debug("[ItemController] addItem() called by '{}' with dto: {}", username, dto);

        Item item = mapDtoToItem(dto);

        if (debug) logger.debug("[ItemController] Mapped DTO -> Item (before save): {}", safeToString(item));

        Item saved;
        try {
            saved = itemService.addItem(item, username);
        } catch (RuntimeException ex) {
            logger.error("[ItemController] addItem() failed for user='{}', item='{}'. Error: {}",
                    username, item.getName(), ex.getMessage(), ex);
            throw ex;
        }

        if (debug) logger.debug("[ItemController] Item saved: id={}, owner={}, name={}",
                saved.getId(), saved.getOwnerId(), saved.getName());

        return ResponseEntity.ok(ItemResponse.fromEntity(saved));
    }

    // ----------------------------------------------------
    // GET ALL AVAILABLE ITEMS
    // ----------------------------------------------------
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ItemResponse>> getAllAvailableItems() {

        if (debug) logger.debug("[ItemController] getAllAvailableItems() called");

        List<Item> list = itemService.getAllAvailableItems();

        if (debug) logger.debug("[ItemController] Retrieved {} available items", list.size());

        return ResponseEntity.ok(list.stream().map(ItemResponse::fromEntity).toList());
    }

    // ----------------------------------------------------
    // GET ITEM BY ID
    // ----------------------------------------------------
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ItemResponse> getItemById(@PathVariable String id) {

        if (debug) logger.debug("[ItemController] getItemById() called for id={}", id);

        Item item = itemService.getItemById(id);

        if (debug) logger.debug("[ItemController] Found item: {}", safeToString(item));

        return ResponseEntity.ok(ItemResponse.fromEntity(item));
    }

    // ----------------------------------------------------
    // UPDATE ITEM
    // ----------------------------------------------------
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable String id,
            @Valid @RequestBody ItemDto dto,
            Authentication auth
    ) {
        String username = extractUsername(auth);

        if (debug) logger.debug("[ItemController] updateItem() called for id={} by '{}', dto={}", id, username, dto);

        Item updatedItem = mapDtoToItem(dto);

        if (debug) logger.debug("[ItemController] Mapped DTO -> Item (update): {}", safeToString(updatedItem));

        Item saved;
        try {
            saved = itemService.updateItem(id, updatedItem, username);
        } catch (RuntimeException ex) {
            logger.error("[ItemController] updateItem() failed for id={}, user={}, error={}",
                    id, username, ex.getMessage(), ex);
            throw ex;
        }

        if (debug) logger.debug("[ItemController] updateItem() succeeded for id={}, savedName={}", id, saved.getName());

        return ResponseEntity.ok(ItemResponse.fromEntity(saved));
    }

    // ----------------------------------------------------
    // DELETE ITEM
    // ----------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(
            @PathVariable String id,
            Authentication auth
    ) {
        String username = extractUsername(auth);

        if (debug) logger.debug("[ItemController] deleteItem() called for id={} by '{}'", id, username);

        try {
            itemService.deleteItem(id, username);
        } catch (RuntimeException ex) {
            logger.error("[ItemController] deleteItem() failed for id={}, user={}, error={}",
                    id, username, ex.getMessage(), ex);
            throw ex;
        }

        if (debug) logger.debug("[ItemController] deleteItem() succeeded for id={} by '{}'", id, username);

        return ResponseEntity.ok("Item deleted successfully");
    }

    // ----------------------------------------------------
    // GET MY ITEMS
    // ----------------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<List<ItemResponse>> getMyItems(Authentication auth) {

        String username = extractUsername(auth);

        if (debug) logger.debug("[ItemController] getMyItems() called by '{}'", username);

        List<Item> items = itemService.getMyItems(username);

        if (debug) logger.debug("[ItemController] getMyItems() returned {} items for '{}'", items.size(), username);

        return ResponseEntity.ok(items.stream().map(ItemResponse::fromEntity).toList());
    }

    // ----------------------------------------------------
    // GET MY AVAILABLE ITEMS
    // ----------------------------------------------------
    @GetMapping("/my/available")
    public ResponseEntity<List<ItemResponse>> getMyAvailableItems(Authentication auth) {

        String username = extractUsername(auth);

        if (debug) logger.debug("[ItemController] getMyAvailableItems() called by '{}'", username);

        List<Item> items = itemService.getMyAvailableItems(username);

        if (debug) logger.debug("[ItemController] getMyAvailableItems() returned {} items for '{}'", items.size(), username);

        return ResponseEntity.ok(items.stream().map(ItemResponse::fromEntity).toList());
    }

    // ----------------------------------------------------
    // ITEM REQUEST
    // ----------------------------------------------------
    @PostMapping("/{itemId}/request")
    public ResponseEntity<Request> requestItem(
            @PathVariable String itemId,
            @Valid @RequestBody RequestDto dto,
            Authentication auth
    ) {
        String username = auth.getName();
        Request req = itemService.requestItem(itemId, dto, username);
        return ResponseEntity.ok(req);
    }

    // ----------------------------------------------------
    // DTO → ENTITY MAPPER  (ownerId removed)
    // ----------------------------------------------------
    private Item mapDtoToItem(ItemDto dto) {
        Item item = new Item();

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setCategory(dto.getCategory());
        item.setCondition(dto.getCondition());

        item.setLatitude(dto.getLatitude() != null ? dto.getLatitude() : 0.0);
        item.setLongitude(dto.getLongitude() != null ? dto.getLongitude() : 0.0);
        item.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);

        item.setImageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : new ArrayList<>());
        item.setTags(dto.getTags() != null ? dto.getTags() : new ArrayList<>());

        item.setCity(dto.getCity());
        item.setState(dto.getState());
        item.setCountry(dto.getCountry());
        item.setStreet(dto.getStreet());
        item.setPincode(dto.getPincode());

        item.setPricePerDay(dto.getPricePerDay() != null ? dto.getPricePerDay() : 0.0);
        item.setSecurityDeposit(dto.getSecurityDeposit() != null ? dto.getSecurityDeposit() : 0.0);
        item.setDeliveryCharge(dto.getDeliveryCharge() != null ? dto.getDeliveryCharge() : 0.0);

        item.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 0);

        // 🔥 Removed availableFrom & availableUntil — as requested

        item.setMinRentalDays(dto.getMinRentalDays() != null ? dto.getMinRentalDays() : 0);
        item.setMaxRentalDays(dto.getMaxRentalDays() != null ? dto.getMaxRentalDays() : 0);

        item.setDeliveryOption(dto.getDeliveryOption());

        return item;
    }

    // ----------------------------------------------------
    // Extract username
    // ----------------------------------------------------
    private String extractUsername(Authentication auth) {
        if (auth == null) {
            throw new BadRequestException("Authentication required.");
        }
        return auth.getName();
    }

    // ----------------------------------------------------
    // Safe debug printer
    // ----------------------------------------------------
    private String safeToString(Item item) {
        if (item == null) return "null";

        return String.format(
                "Item{id=%s, name=%s, ownerId=%s, category=%s, available=%s, qty=%d}",
                item.getId(),
                item.getName(),
                item.getOwnerId(),
                item.getCategory(),
                item.isAvailable(),
                item.getQuantity()
        );
    }
}