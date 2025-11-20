package com.gangwarsatyam.sharenest.repository;

import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.RequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {

    List<Request> findByBorrowerId(String borrowerId);

    List<Request> findByOwnerId(String ownerId);

    // 🔥 Fetch all active (blocking) requests for an item
    List<Request> findByItemIdAndStatusIn(String itemId, List<RequestStatus> statuses);

    // Get all requests for a particular item
    List<Request> findByItemId(String itemId);
}
