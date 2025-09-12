package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.RequestRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private static final Logger logger = LoggerFactory.getLogger(RequestService.class);

    @Value("${app.debug}")
    private boolean debug;

    private final RequestRepository requestRepo;
    private final ItemRepository itemRepo;
    private final UserRepository userRepo;

    public Request submitRequest(String itemId, String borrowerId) {
        if (debug) logger.debug("Submitting request by borrower: {} for item: {}", borrowerId, itemId);

        Item item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.isAvailable()) {
            throw new RuntimeException("Item is currently unavailable");
        }

        User borrower = userRepo.findById(borrowerId)
                .orElseThrow(() -> new RuntimeException("Borrower not found"));

        Request req = Request.builder()
                .itemId(itemId)
                .borrowerId(borrowerId)
                .ownerId(item.getOwnerId())
                .status("PENDING")
                .build();

        requestRepo.save(req);

        item.setAvailable(false);
        itemRepo.save(item);

        logger.info("Borrow request {} submitted by {} for item {}", req.getId(), borrowerId, itemId);
        return req;
    }

    public List<Request> getRequestsByBorrower(String borrowerId) {
        if (debug) logger.debug("Getting requests by borrower: {}", borrowerId);
        return requestRepo.findByBorrowerId(borrowerId);
    }

    public List<Request> getRequestsByOwner(String ownerId) {
        if (debug) logger.debug("Getting requests by owner: {}", ownerId);
        return requestRepo.findByOwnerId(ownerId);
    }

    public void cancelRequest(String requestId, String borrowerId) {
        if (debug) logger.debug("Cancelling request: {} by borrower: {}", requestId, borrowerId);

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getBorrowerId().equals(borrowerId)) {
            throw new RuntimeException("You can cancel only your own requests");
        }

        if (!"PENDING".equals(req.getStatus())) {
            throw new RuntimeException("Only pending requests can be cancelled");
        }

        req.setStatus("CANCELLED");
        requestRepo.save(req);

        Item item = itemRepo.findById(req.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setAvailable(true);
        itemRepo.save(item);

        logger.info("Request {} cancelled by borrower {}", requestId, borrowerId);
    }
}
