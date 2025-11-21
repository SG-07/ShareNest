package com.gangwarsatyam.sharenest.repository;

import com.gangwarsatyam.sharenest.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookingRepository extends MongoRepository<Booking, String> {
}