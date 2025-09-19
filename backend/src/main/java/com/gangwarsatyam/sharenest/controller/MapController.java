package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.ItemResponse;
import com.gangwarsatyam.sharenest.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/map-items")
@RequiredArgsConstructor
public class MapController {

    private final ItemService itemService;

    @GetMapping
    public ResponseEntity<List<ItemResponse>> getMapItems() {
        List<ItemResponse> responses = itemService.getAllItems()
                .stream()
                .filter(i -> i.getLatitude() != 0 && i.getLongitude() != 0) // only items with coords
                .map(ItemResponse::fromEntity) // ✅ convert Item → ItemResponse
                .toList();

        return ResponseEntity.ok(responses);
    }
}
