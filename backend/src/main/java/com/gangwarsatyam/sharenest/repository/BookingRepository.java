package com.gangwarsatyam.sharenest.repository;

import com.gangwarsatyam.sharenest.model.Booking;
import com.gangwarsatyam.sharenest.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    // ---------------------------------------------------------------
    // BASIC FETCH QUERIES
    // ---------------------------------------------------------------

    /** Get all bookings for an item */
    List<Booking> findByItemId(String itemId);

    /** Get all bookings made by a renter */
    List<Booking> findByRenterId(String renterId);

    /** Get all bookings for items owned by a user */
    List<Booking> findByOwnerId(String ownerId);

    /** Get active bookings for a renter (NOT cancelled) */
    List<Booking> findByRenterIdAndStatusNot(String renterId, BookingStatus status);


    // ---------------------------------------------------------------
    // DATE RANGE CONFLICT QUERIES
    // ---------------------------------------------------------------

    /**
     * Detect overlapping bookings:
     * (existing.start <= newEnd) AND (existing.end >= newStart)
     */
    List<Booking> findByItemIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            String itemId,
            LocalDate newEnd,
            LocalDate newStart
    );


    // ---------------------------------------------------------------
    // STATUS FILTERING
    // ---------------------------------------------------------------

    /** Get bookings for an item by status */
    List<Booking> findByItemIdAndStatus(String itemId, BookingStatus status);

    /** Get pending bookings for owner dashboard */
    List<Booking> findByOwnerIdAndStatus(String ownerId, BookingStatus status);


    // ---------------------------------------------------------------
    // CLEANUP & MANAGEMENT
    // ---------------------------------------------------------------

    /** Delete all bookings for a specific item */
    void deleteByItemId(String itemId);

    /** Count how many bookings an item has */
    long countByItemId(String itemId);
}
