package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.RequestRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private static final Logger logger = LoggerFactory.getLogger(RequestService.class);
    private final RequestRepository requestRepo;
    private final ItemRepository itemRepo;
    private final UserRepository userRepo;

    public Request submitRequest(String itemId, String borrowerId) {
        Item item = itemRepo.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.isAvailable()) throw new RuntimeException("Item is currently unavailable");

        User borrower = userRepo.findById(Long.parseLong(borrowerId)).orElseThrow(() -> new RuntimeException("Borrower not found"));
        Request req = Request.builder()
                .itemId(itemId)
                .borrowerId(borrowerId)
                .ownerId(item.getOwnerId())
                .status("PENDING")
                .build();
        requestRepo.save(req);
        item.setAvailable(false); // lock item
        itemRepo.save(item);
        logger.info("Borrow request {} submitted by {} for item {}", req.getId(), borrowerId, itemId);
        return req;
    }

    public List<Request> getRequestsByBorrower(String borrowerId) {
        return requestRepo.findByBorrowerId(borrowerId);
    }

    public List<Request> getRequestsByOwner(String ownerId) {
        return requestRepo.findByOwnerId(ownerId);
    }

    public void cancelRequest(String requestId, String borrowerId) {
        Request req = requestRepo.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        if (!req.getBorrowerId().equals(borrowerId)) throw new RuntimeException("You can cancel only your own requests");

        if (!"PENDING".equals(req.getStatus())) throw new RuntimeException("Only pending requests can be cancelled");

        req.setStatus("CANCELLED");
        requestRepo.save(req);
        // unlock item
        Item item = itemRepo.findById(req.getItemId()).get();
        item.setAvailable(true);
        itemRepo.save(item);
        logger.info("Request {} cancelled by borrower {}", requestId, borrowerId);
    }
}