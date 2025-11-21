package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.BookingRequestDto;
import com.gangwarsatyam.sharenest.dto.BookingResponseDto;
import com.gangwarsatyam.sharenest.service.BookingService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/{itemId}")
    public ResponseEntity<BookingResponseDto> createBooking(
            @PathVariable String itemId,
            @RequestParam String renterId,
            @RequestBody BookingRequestDto requestDto
    ) {
        return ResponseEntity.ok(
                bookingService.createBooking(itemId, renterId, requestDto)
        );
    }
}
