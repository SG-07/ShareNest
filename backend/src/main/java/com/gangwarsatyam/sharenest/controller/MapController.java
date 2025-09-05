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
        // In production you'd filter by distance, but here we return all items with coords
        return ResponseEntity.ok(itemService.getAllItems()
                .stream()
                .filter(i -> i.getLatitude() != 0 && i.getLongitude() != 0)
                .toList());
    }
}