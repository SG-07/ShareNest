package com.gangwarsatyam.sharenest.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.gangwarsatyam.sharenest.model.Item;
import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {

    // Get items marked available
    List<Item> findByAvailableTrue();

    // Get all items owned by a user
    List<Item> findByOwnerId(String ownerId);

    // Get only available items owned by a user
    List<Item> findByOwnerIdAndAvailableTrue(String ownerId);
}
