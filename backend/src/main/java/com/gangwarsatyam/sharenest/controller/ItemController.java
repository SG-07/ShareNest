package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.ItemDto;
import com.gangwarsatyam.sharenest.dto.ItemResponse;
import com.gangwarsatyam.sharenest.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public ResponseEntity<List<ItemResponse>> listItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItem(@PathVariable String id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ItemResponse> addItem(
            @Valid @ModelAttribute ItemDto dto,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User owner) throws IOException {

        ItemResponse saved = itemService.addItem(dto, image, owner);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}