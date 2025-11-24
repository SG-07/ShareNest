package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.BookingRequestDto;
import com.gangwarsatyam.sharenest.dto.BookingResponseDto;
import com.gangwarsatyam.sharenest.model.*;
import com.gangwarsatyam.sharenest.repository.BookingRepository;
import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public BookingResponseDto createBooking(String itemId, String renterId, BookingRequestDto dto) {

        log.debug("Creating booking: item={}, renter={}", itemId, renterId);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        User renter = userRepository.findById(renterId)
                .orElseThrow(() -> new RuntimeException("User not found: " + renterId));

        LocalDate start = dto.getStartDate().toLocalDate();
        LocalDate end = dto.getEndDate().toLocalDate();

        // ----------------------------
        // VALIDATE DATE RANGE
        // ----------------------------
        if (end.isBefore(start)) {
            throw new RuntimeException("End date cannot be before start date.");
        }

        // ----------------------------
        // CHECK DATE CONFLICTS
        // ----------------------------
        for (UnavailableDateRange range : item.getNotAvailable()) {
            if (datesOverlap(start, end, range.getStart(), range.getEnd())) {
                throw new RuntimeException("Item is not available for selected dates.");
            }
        }

        // -----------------------------------------------------
        // CREATE BOOKING (PENDING)
        // -----------------------------------------------------
        Booking booking = Booking.builder()
                .itemId(itemId)
                .ownerId(item.getOwnerId())
                .renterId(renterId)
                .startDate(start)
                .endDate(end)
                .status(BookingStatus.PENDING)
                .details(dto.getDetails())
                .build();

        Booking saved = bookingRepository.save(booking);


        // -----------------------------------------------------
        // UPDATE ITEM UNAVAILABLE DATES
        // -----------------------------------------------------
        List<UnavailableDateRange> list = item.getNotAvailable();
        if (list == null) list = new ArrayList<>();

        list.add(new UnavailableDateRange(start, end));
        item.setNotAvailable(list);

        itemRepository.save(item);

        log.debug("Booking {} created & date range blocked", saved.getId());

        return convertToResponse(saved);
    }

    // ----------------------------
    // HELPER: CHECK DATE OVERLAP
    // ----------------------------
    private boolean datesOverlap(LocalDate s1, LocalDate e1, LocalDate s2, LocalDate e2) {
        return !s1.isAfter(e2) && !e1.isBefore(s2);
    }

    // ----------------------------
    // CONVERT ENTITY TO DTO
    // ----------------------------
    private BookingResponseDto convertToResponse(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .itemId(booking.getItemId())
                .renterId(booking.getRenterId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .status(booking.getStatus())
                .details(booking.getDetails())
                .build();
    }
}