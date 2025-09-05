package com.gangwarsatyam.sharenest.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {
    @Id private String id;
    private String itemId;
    private String borrowerId;
    private String ownerId;
    private String status;   // PENDING, ACCEPTED, DECLINED, CANCELLED
    private long requestDate = System.currentTimeMillis();
}