package com.gangwarsatyam.sharenest.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByAvailableTrue();
}