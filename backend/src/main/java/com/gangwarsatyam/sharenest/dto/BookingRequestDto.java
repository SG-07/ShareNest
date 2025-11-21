package com.gangwarsatyam.sharenest.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class BookingRequestDto {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Map<String, Object> details;
}