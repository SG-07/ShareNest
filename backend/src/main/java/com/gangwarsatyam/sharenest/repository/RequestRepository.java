package com.gangwarsatyam.sharenest.repository;

import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.RequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {

    // Borrower perspective (requests the user SENT)
    List<Request> findByBorrowerId(String borrowerId);

    // Owner perspective (requests the user RECEIVED)
    List<Request> findByOwnerId(String ownerId);

    // For validating overlapping bookings (active + accepted)
    List<Request> findByItemIdAndStatusIn(String itemId, List<RequestStatus> statuses);

    // Optional: get all requests for a given item
    List<Request> findByItemId(String itemId);
}
