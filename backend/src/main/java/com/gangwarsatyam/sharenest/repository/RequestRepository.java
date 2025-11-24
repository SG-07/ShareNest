package com.gangwarsatyam.sharenest.repository;

import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.RequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {

    // ------------------------------
    // Borrower perspective (requests SENT by user)
    // ------------------------------
    List<Request> findByBorrowerId(String borrowerId);

    // ------------------------------
    // Owner perspective (requests RECEIVED by user)
    // ------------------------------
    List<Request> findByOwnerId(String ownerId);

    // ------------------------------
    // Validate overlapping bookings:
    // checks ACTIVE + ACCEPTED + PROGRESS statuses for that item
    // ------------------------------
    List<Request> findByItemIdAndStatusIn(String itemId, List<RequestStatus> statuses);

    // ------------------------------
    // Optional: All requests for an item
    // ------------------------------
    List<Request> findByItemId(String itemId);
}