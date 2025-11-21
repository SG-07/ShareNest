package com.gangwarsatyam.sharenest.dto;

import com.gangwarsatyam.sharenest.model.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class BookingResponseDto {
    private String id;
    private String itemId;
    private String renterId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BookingStatus status;
    private Map<String, Object> details;
}