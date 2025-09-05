package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.TrustScoreDto;
import com.gangwarsatyam.sharenest.service.TrustScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trust-score")
@RequiredArgsConstructor
public class TrustScoreController {

    private final TrustScoreService trustService;

    @GetMapping("/{userId}")
    public ResponseEntity<TrustScoreDto> getScore(@PathVariable String userId) {
        return ResponseEntity.ok(trustService.calculateTrustScore(userId));
    }
}