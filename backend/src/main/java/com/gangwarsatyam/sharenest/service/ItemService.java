package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    // ✅ Fetch all items (for map display)
    public List<Item> getAllItems() {
        logger.debug("[ItemService] Fetching ALL items (map view)");
        return itemRepository.findAll();
    }

    // ✅ Add item
    public Item addItem(Item item, String username) {
        String ownerId = userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        item.setOwnerId(ownerId);
        item.setAvailable(true);

        Item saved = itemRepository.save(item);
        logger.debug("[ItemService] Added new item '{}' for user '{}' (ownerId={})",
                item.getName(), username, ownerId);
        return saved;
    }

    // ✅ Fetch all available items
    public List<Item> getAllAvailableItems() {
        logger.debug("[ItemService] Fetching all available items");
        return itemRepository.findByAvailableTrue();
    }

    // ✅ Update item (only owner can update)
    public Item updateItem(String itemId, Item updatedItem, String username) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        String ownerId = userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (!item.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized to update this item");
        }

        item.setName(updatedItem.getName());
        item.setDescription(updatedItem.getDescription());
        item.setCategory(updatedItem.getCategory());
        item.setCondition(updatedItem.getCondition());
        item.setLatitude(updatedItem.getLatitude());
        item.setLongitude(updatedItem.getLongitude());
        item.setAvailable(updatedItem.isAvailable());

        Item saved = itemRepository.save(item);
        logger.debug("[ItemService] Updated item '{}' for user '{}' (ownerId={})",
                item.getName(), username, ownerId);
        return saved;
    }

    // ✅ Delete item (only owner can delete)
    public void deleteItem(String itemId, String username) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        String ownerId = userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (!item.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized to delete this item");
        }

        itemRepository.delete(item);
        logger.debug("[ItemService] Deleted item '{}' for user '{}' (ownerId={})",
                item.getName(), username, ownerId);
    }

    // ✅ Get logged-in user's items
    public List<Item> getMyItems(String username) {
        String ownerId = userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        logger.debug("[ItemService] Fetching ALL items for user '{}' (ownerId={})", username, ownerId);
        return itemRepository.findByOwnerId(ownerId);
    }

    // ✅ Get logged-in user's available items
    public List<Item> getMyAvailableItems(String username) {
        String ownerId = userRepository.findByUsername(username)
                .map(u -> u.getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        logger.debug("[ItemService] Fetching AVAILABLE items for user '{}' (ownerId={})", username, ownerId);
        return itemRepository.findByOwnerIdAndAvailableTrue(ownerId);
    }
}
