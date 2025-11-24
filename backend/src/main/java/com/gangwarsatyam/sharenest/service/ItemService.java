package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.ItemCondition;
import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.dto.RequestDto;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import com.gangwarsatyam.sharenest.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final RequestService requestService;

    @Value("${app.debug:false}")
    private boolean debug;

    // ---------------------------------------------------------
    // REQUEST ITEM
    // ---------------------------------------------------------
    public Request requestItem(String itemId, RequestDto dto, String username) {
        if (debug) logger.debug("[ItemService] requestItem() called by '{}' for itemId={}, dto={}", username, itemId, dto);

        String borrowerId = getOwnerIdFromUsername(username);

        if (!itemId.equals(dto.getItemId())) {
            throw new IllegalArgumentException("Item ID in path and request body must match");
        }

        Request req = requestService.submitRequest(dto, borrowerId);

        if (debug) logger.debug("[ItemService] Request submitted: {}", req.getId());
        return req;
    }

    // ---------------------------------------------------------
    // READ
    // ---------------------------------------------------------
    public Item getItemById(String id) {
        if (debug) logger.debug("[ItemService] getItemById({})", id);
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    public List<Item> getAllAvailableItems() {
        if (debug) logger.debug("[ItemService] getAllAvailableItems()");
        return itemRepository.findByAvailableTrue();
    }

    public Page<Item> getAllAvailableItems(Pageable pageable) {
        if (debug) logger.debug("[ItemService] getAllAvailableItems(pageable)");
        return itemRepository.findByAvailableTrue(pageable);
    }

    public List<Item> searchItemsByName(String keyword) {
        if (debug) logger.debug("[ItemService] searchItemsByName('{}')", keyword);
        return itemRepository.findByNameContainingIgnoreCaseAndAvailableTrue(keyword);
    }

    public Page<Item> searchItemsByName(String keyword, Pageable pageable) {
        if (debug) logger.debug("[ItemService] searchItemsByName('{}', pageable)", keyword);
        return itemRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }

    public List<Item> filterByCategory(String category) {
        if (debug) logger.debug("[ItemService] filterByCategory('{}')", category);
        return itemRepository.findByCategoryIgnoreCaseAndAvailableTrue(category);
    }

    public List<Item> filterByCondition(ItemCondition condition) {
        if (debug) logger.debug("[ItemService] filterByCondition({})", condition);
        return itemRepository.findByCondition(condition);
    }

    // ---------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------
    public Item addItem(Item item, String username) {
        if (debug) logger.debug("[ItemService] addItem() invoked by '{}'", username);

        String ownerId = getOwnerIdFromUsername(username);

        item.setOwnerId(ownerId);

        if (item.getImageUrls() == null) item.setImageUrls(new ArrayList<>());
        if (item.getTags() == null) item.setTags(new ArrayList<>());
        if (item.getNotAvailable() == null) item.setNotAvailable(new ArrayList<>());

        if (item.getQuantity() <= 0) item.setQuantity(1);

        if (item.getPricePerDay() < 0) item.setPricePerDay(0.0);
        if (item.getSecurityDeposit() < 0) item.setSecurityDeposit(0.0);
        if (item.getDeliveryCharge() < 0) item.setDeliveryCharge(0.0);

        item.setViews(0);
        item.setLikes(0);

        // No availableUntil validation anymore
        validateAvailableFrom(item.getAvailableFrom());

        Item saved = itemRepository.save(item);

        if (debug) logger.debug("[ItemService] Item added: {}", saved);
        return saved;
    }

    // ---------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------
    public Item updateItem(String itemId, Item updatedItem, String username) {
        if (debug) logger.debug("[ItemService] updateItem({}, updatedItem, {})", itemId, username);

        Item existing = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        String ownerId = getOwnerIdFromUsername(username);

        if (!Objects.equals(existing.getOwnerId(), ownerId)) {
            throw new RuntimeException("Unauthorized to update this item");
        }

        // BASIC DETAILS
        if (updatedItem.getName() != null) existing.setName(updatedItem.getName());
        if (updatedItem.getDescription() != null) existing.setDescription(updatedItem.getDescription());
        if (updatedItem.getCategory() != null) existing.setCategory(updatedItem.getCategory());
        if (updatedItem.getCondition() != null) existing.setCondition(updatedItem.getCondition());

        existing.setAvailable(updatedItem.isAvailable());
        existing.setLatitude(updatedItem.getLatitude());
        existing.setLongitude(updatedItem.getLongitude());

        // LISTS
        existing.setImageUrls(updatedItem.getImageUrls() != null ? updatedItem.getImageUrls() : new ArrayList<>());
        existing.setTags(updatedItem.getTags() != null ? updatedItem.getTags() : new ArrayList<>());
        existing.setNotAvailable(updatedItem.getNotAvailable() != null ? updatedItem.getNotAvailable() : new ArrayList<>());

        // LOCATION
        if (updatedItem.getCity() != null) existing.setCity(updatedItem.getCity());
        if (updatedItem.getState() != null) existing.setState(updatedItem.getState());
        if (updatedItem.getCountry() != null) existing.setCountry(updatedItem.getCountry());
        if (updatedItem.getStreet() != null) existing.setStreet(updatedItem.getStreet());
        if (updatedItem.getPincode() != null) existing.setPincode(updatedItem.getPincode());

        // RENTAL SETTINGS
        if (updatedItem.getPricePerDay() >= 0) existing.setPricePerDay(updatedItem.getPricePerDay());
        if (updatedItem.getSecurityDeposit() >= 0) existing.setSecurityDeposit(updatedItem.getSecurityDeposit());
        if (updatedItem.getDeliveryCharge() >= 0) existing.setDeliveryCharge(updatedItem.getDeliveryCharge());
        if (updatedItem.getQuantity() > 0) existing.setQuantity(updatedItem.getQuantity());

        if (updatedItem.getMinRentalDays() != 0) existing.setMinRentalDays(updatedItem.getMinRentalDays());
        if (updatedItem.getMaxRentalDays() != 0) existing.setMaxRentalDays(updatedItem.getMaxRentalDays());

        // AVAILABLE FROM
        if (updatedItem.getAvailableFrom() != null) {
            validateAvailableFrom(updatedItem.getAvailableFrom());
            existing.setAvailableFrom(updatedItem.getAvailableFrom());
        }

        if (updatedItem.getDeliveryOption() != null) existing.setDeliveryOption(updatedItem.getDeliveryOption());

        Item saved = itemRepository.save(existing);

        if (debug) logger.debug("[ItemService] Item updated: {} (by user {})", saved.getId(), username);
        return saved;
    }

    // ---------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------
    public void deleteItem(String itemId, String username) {
        if (debug) logger.debug("[ItemService] deleteItem({}, {})", itemId, username);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        String ownerId = getOwnerIdFromUsername(username);

        if (!Objects.equals(item.getOwnerId(), ownerId)) {
            throw new RuntimeException("Unauthorized to delete this item");
        }

        itemRepository.delete(item);

        if (debug) logger.debug("[ItemService] Item deleted: {} by {}", itemId, username);
    }

    // ---------------------------------------------------------
    // OWNER QUERIES
    // ---------------------------------------------------------
    public List<Item> getMyItems(String username) {
        String ownerId = getOwnerIdFromUsername(username);
        return itemRepository.findByOwnerId(ownerId);
    }

    public List<Item> getMyAvailableItems(String username) {
        String ownerId = getOwnerIdFromUsername(username);
        return itemRepository.findByOwnerIdAndAvailableTrue(ownerId);
    }

    public Page<Item> getMyItems(String username, Pageable pageable) {
        String ownerId = getOwnerIdFromUsername(username);
        return itemRepository.findByOwnerId(ownerId, pageable);
    }

    // ---------------------------------------------------------
    // STATS
    // ---------------------------------------------------------
    public void incrementViews(String itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));
        item.setViews(item.getViews() + 1);
        itemRepository.save(item);
    }

    public void likeItem(String itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));
        item.setLikes(item.getLikes() + 1);
        itemRepository.save(item);
    }

    public void unlikeItem(String itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));
        item.setLikes(Math.max(0, item.getLikes() - 1));
        itemRepository.save(item);
    }

    public long countByOwnerId(String ownerId) {
        return itemRepository.countByOwnerId(ownerId);
    }

    public void deleteByOwnerId(String ownerId) {
        itemRepository.deleteByOwnerId(ownerId);
    }

    // ---------------------------------------------------------
    // PRIVATE UTIL
    // ---------------------------------------------------------
    private String getOwnerIdFromUsername(String username) {
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    private void validateAvailableFrom(LocalDate from) {
        // Currently only ensures availableFrom is not in the past (optional rule)
        if (from != null && from.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("availableFrom cannot be in the past");
        }
    }
}
