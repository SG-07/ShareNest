package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.ItemCondition;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public Item getItemById(String id) {
        logger.debug("[ItemService] Fetching item by id: {}", id);
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    public Item addItem(Item item, String username) {

        String ownerId = userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        item.setOwnerId(ownerId);

        // Ensure lists are never null
        if (item.getImageUrls() == null) item.setImageUrls(new ArrayList<>());
        if (item.getTags() == null) item.setTags(new ArrayList<>());

        item.setCondition(item.getCondition());

        item.setViews(0);
        item.setLikes(0);

        Item saved = itemRepository.save(item);

        logger.debug("[ItemService] Added item '{}' by user '{}' (ownerId={})",
                item.getName(), username, ownerId);

        return saved;
    }

    public Item updateItem(String itemId, Item updatedItem, String username) {

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        String ownerId = userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (!item.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized to update this item");
        }

        // Update basic fields
        item.setName(updatedItem.getName());
        item.setDescription(updatedItem.getDescription());
        item.setCategory(updatedItem.getCategory());

        // Convert string → enum
        if (item.getCondition() != null) {
            item.setCondition(
                    ItemCondition.fromString(item.getCondition().toString())
            );
        }

        item.setAvailable(updatedItem.isAvailable());
        item.setLatitude(updatedItem.getLatitude());
        item.setLongitude(updatedItem.getLongitude());

        // Safe copy of image URLs
        item.setImageUrls(
                updatedItem.getImageUrls() != null ? updatedItem.getImageUrls() : new ArrayList<>()
        );

        // Safe copy of tags
        item.setTags(
                updatedItem.getTags() != null ? updatedItem.getTags() : new ArrayList<>()
        );

        // Address fields
        item.setCity(updatedItem.getCity());
        item.setState(updatedItem.getState());
        item.setCountry(updatedItem.getCountry());
        item.setStreet(updatedItem.getStreet());
        item.setPincode(updatedItem.getPincode());

        Item saved = itemRepository.save(item);

        logger.debug("[ItemService] Updated item '{}' by user '{}' (ownerId={})",
                saved.getName(), username, ownerId);

        return saved;
    }

    public List<Item> getAllAvailableItems() {
        return itemRepository.findByAvailableTrue();
    }

    public void deleteItem(String itemId, String username) {

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        String ownerId = userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (!item.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized to delete this item");
        }

        itemRepository.delete(item);
    }

    public List<Item> getMyItems(String username) {
        String ownerId = userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return itemRepository.findByOwnerId(ownerId);
    }

    public List<Item> getMyAvailableItems(String username) {
        String ownerId = userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return itemRepository.findByOwnerIdAndAvailableTrue(ownerId);
    }
}
