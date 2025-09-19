package com.gangwarsatyam.sharenest.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.gangwarsatyam.sharenest.model.Item;
import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {

    // Get all available items
    List<Item> findByAvailableTrue();

    // Get all items owned by a user
    List<Item> findByOwnerId(String ownerId);

    // Get available items owned by a user
    List<Item> findByOwnerIdAndAvailableTrue(String ownerId);
}
