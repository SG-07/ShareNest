package com.gangwarsatyam.sharenest.dto;

import com.gangwarsatyam.sharenest.model.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
public class BookingResponseDto {
    private String id;
    private String itemId;
    private String renterId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
    private Map<String, Object> details;
}
