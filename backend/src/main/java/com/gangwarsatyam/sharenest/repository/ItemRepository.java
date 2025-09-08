package com.gangwarsatyam.sharenest.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.gangwarsatyam.sharenest.model.Item;
import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByAvailableTrue();
}