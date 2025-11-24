package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    // Store IDs instead of DBRef for cleaner Mongo design (recommended)
    private String itemId;
    private String renterId;
    private String ownerId;

    private LocalDate startDate;
    private LocalDate endDate;

    private BookingStatus status;

    private Map<String, Object> details;
}