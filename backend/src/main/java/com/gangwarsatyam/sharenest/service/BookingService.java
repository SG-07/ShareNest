package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.BookingRequestDto;
import com.gangwarsatyam.sharenest.dto.BookingResponseDto;
import com.gangwarsatyam.sharenest.model.BookingStatus;
import com.gangwarsatyam.sharenest.model.Booking;
import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.BookingRepository;
import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public BookingResponseDto createBooking(String itemId, String renterId, BookingRequestDto dto) {

        log.debug("Creating new booking for item={} by renter={}", itemId, renterId);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        User renter = userRepository.findById(renterId)
                .orElseThrow(() -> new RuntimeException("User not found: " + renterId));

        Booking booking = Booking.builder()
                .item(item)
                .renter(renter)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(BookingStatus.PENDING)
                .details(dto.getDetails())
                .build();

        Booking saved = bookingRepository.save(booking);

        log.debug("Booking created with id={}", saved.getId());

        return convertToResponse(saved);
    }

    private BookingResponseDto convertToResponse(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .itemId(booking.getItem().getId())
                .renterId(booking.getRenter().getId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .status(booking.getStatus())
                .details(booking.getDetails())
                .build();
    }
}
