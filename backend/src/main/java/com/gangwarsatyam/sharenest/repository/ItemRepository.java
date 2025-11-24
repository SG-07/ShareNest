package com.gangwarsatyam.sharenest.repository;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.ItemCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {

    // ============================================================
    // BASIC QUERIES
    // ============================================================

    /** Get all available items (non-paginated) */
    List<Item> findByAvailableTrue();

    /** Get all items owned by a user */
    List<Item> findByOwnerId(String ownerId);

    /** Get only available items owned by a user */
    List<Item> findByOwnerIdAndAvailableTrue(String ownerId);



    // ============================================================
    // PAGINATION SUPPORT
    // ============================================================

    /** Paginated available items */
    Page<Item> findByAvailableTrue(Pageable pageable);

    /** Paginated items of a user */
    Page<Item> findByOwnerId(String ownerId, Pageable pageable);

    /** Paginated available items of a user */
    Page<Item> findByOwnerIdAndAvailableTrue(String ownerId, Pageable pageable);

    /** Paginated search by name */
    Page<Item> findByNameContainingIgnoreCase(String name, Pageable pageable);



    // ============================================================
    // SEARCH SUPPORT
    // ============================================================

    /** Search by item name */
    List<Item> findByNameContainingIgnoreCase(String name);

    /** Search only available items by name */
    List<Item> findByNameContainingIgnoreCaseAndAvailableTrue(String name);



    // ============================================================
    // FILTERS
    // ============================================================

    /** Filter by condition */
    List<Item> findByCondition(ItemCondition condition);

    /** Filter by category */
    List<Item> findByCategoryIgnoreCase(String category);

    /** Filter only available items by category */
    List<Item> findByCategoryIgnoreCaseAndAvailableTrue(String category);

    /** Filter by price range */
    List<Item> findByPricePerDayBetween(Double min, Double max);

    /** Filter by city */
    List<Item> findByCityIgnoreCase(String city);

    /** Filter by pincode */
    List<Item> findByPincode(String pincode);



    // ============================================================
    // SORTING SUPPORT
    // ============================================================

    /** Sort items owned by user */
    List<Item> findByOwnerId(String ownerId, Sort sort);

    /** Sort available items */
    List<Item> findByAvailableTrue(Sort sort);



    // ============================================================
    // SOFT DELETE SUPPORT (only if Item.deleted = true/false exists)
    // ============================================================

    /** Get all non-deleted items */
    List<Item> findByDeletedFalse();

    /** Get user items excluding deleted ones */
    List<Item> findByOwnerIdAndDeletedFalse(String ownerId);



    // ============================================================
    // BULK OPERATIONS
    // ============================================================

    /** Delete all items of a user */
    void deleteByOwnerId(String ownerId);

    /** Count items of a user */
    long countByOwnerId(String ownerId);
}