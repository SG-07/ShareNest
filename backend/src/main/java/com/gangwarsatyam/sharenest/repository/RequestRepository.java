package com.gangwarsatyam.sharenest.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {
    List<Request> findByBorrowerId(String borrowerId);
    List<Request> findByOwnerId(String ownerId);
}