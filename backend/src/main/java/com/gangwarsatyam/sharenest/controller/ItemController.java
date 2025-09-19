package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
    private final ItemService itemService;

    // ✅ Create
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Item> addItem(@RequestBody Item item, Authentication auth) {
        logger.debug("[ItemController] Received item payload: {}", item);
        String username = auth.getName();
        Item saved = itemService.addItem(item, username);
        return ResponseEntity.ok(saved);
    }

    // ✅ Read all available items
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Item>> getAllAvailableItems() {
        logger.debug("[ItemController] Fetching all available items");
        return ResponseEntity.ok(itemService.getAllAvailableItems());
    }

    // ✅ Update (owner only)
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Item> updateItem(
            @PathVariable String id,
            @RequestBody Item updatedItem,
            Authentication auth) {
        String username = auth.getName();
        logger.debug("[ItemController] Update item {} request by user: {}", id, username);
        Item saved = itemService.updateItem(id, updatedItem, username);
        return ResponseEntity.ok(saved);
    }

    // ✅ Delete (owner only)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(
            @PathVariable String id,
            Authentication auth) {
        String username = auth.getName();
        logger.debug("[ItemController] Delete item {} request by user: {}", id, username);
        itemService.deleteItem(id, username);
        return ResponseEntity.ok("Item deleted successfully");
    }

    // ✅ Get logged-in user's items
    @GetMapping(value = "/my", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Item>> getMyItems(Authentication auth) {
        String username = auth.getName();
        logger.debug("[ItemController] Fetch my items for user: {}", username);
        return ResponseEntity.ok(itemService.getMyItems(username));
    }

    // ✅ Get logged-in user's available items
    @GetMapping(value = "/my/available", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Item>> getMyAvailableItems(Authentication auth) {
        String username = auth.getName();
        logger.debug("[ItemController] Fetch my available items for user: {}", username);
        return ResponseEntity.ok(itemService.getMyAvailableItems(username));
    }
}
