package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.RequestStatus;
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

    @Value("${app.debug:false}")
    private boolean debug;

    private final RequestRepository requestRepo;
    private final ItemRepository itemRepo;
    private final UserRepository userRepo;
    private final TrustScoreService trustScoreService; // to recalc trust scores on status change

    /**
     * Submit a borrow request. Marks item unavailable.
     */
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
                .status(RequestStatus.PENDING)
                .build();

        Request saved = requestRepo.save(req);

        item.setAvailable(false);
        itemRepo.save(item);

        logger.info("Borrow request {} submitted by {} for item {}", saved.getId(), borrowerId, itemId);
        return saved;
    }

    public List<Request> getRequestsByBorrower(String borrowerId) {
        if (debug) logger.debug("Getting requests by borrower: {}", borrowerId);
        return requestRepo.findByBorrowerId(borrowerId);
    }

    public List<Request> getRequestsByOwner(String ownerId) {
        if (debug) logger.debug("Getting requests by owner: {}", ownerId);
        return requestRepo.findByOwnerId(ownerId);
    }

    /**
     * Borrower cancels their own pending request.
     */
    public void cancelRequest(String requestId, String borrowerId) {
        if (debug) logger.debug("Cancelling request: {} by borrower: {}", requestId, borrowerId);

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getBorrowerId().equals(borrowerId)) {
            throw new RuntimeException("You can cancel only your own requests");
        }

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be cancelled");
        }

        req.setStatus(RequestStatus.CANCELLED);
        requestRepo.save(req);

        Item item = itemRepo.findById(req.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setAvailable(true);
        itemRepo.save(item);

        // Recalculate trust score for both parties (no accepted change so score may remain same but recalc is safe)
        safeRecalculateTrust(req.getOwnerId());
        safeRecalculateTrust(req.getBorrowerId());

        logger.info("Request {} cancelled by borrower {}", requestId, borrowerId);
    }

    /**
     * Owner accepts a pending request.
     * After accepting, request status becomes ACCEPTED and trust scores are recalculated.
     */
    public void acceptRequest(String requestId, String ownerId) {
        if (debug) logger.debug("Accepting request: {} by owner: {}", requestId, ownerId);

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You can accept only requests for your own items");
        }

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be accepted");
        }

        req.setStatus(RequestStatus.ACCEPTED);
        requestRepo.save(req);

        // Item stays unavailable (as it already was set). Optionally you can set availability based on your business rules.

        safeRecalculateTrust(req.getOwnerId());
        safeRecalculateTrust(req.getBorrowerId());

        logger.info("Request {} accepted by owner {}", requestId, ownerId);
    }

    /**
     * Owner declines a pending request.
     */
    public void declineRequest(String requestId, String ownerId) {
        if (debug) logger.debug("Declining request: {} by owner: {}", requestId, ownerId);

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You can decline only requests for your own items");
        }

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be declined");
        }

        req.setStatus(RequestStatus.DECLINED);
        requestRepo.save(req);

        // Make item available again
        Item item = itemRepo.findById(req.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setAvailable(true);
        itemRepo.save(item);

        safeRecalculateTrust(req.getOwnerId());
        safeRecalculateTrust(req.getBorrowerId());

        logger.info("Request {} declined by owner {}", requestId, ownerId);
    }

    /**
     * Helper to recalc trust score safely (wraps exceptions).
     */
    private void safeRecalculateTrust(String userId) {
        try {
            if (userId != null) {
                trustScoreService.calculateTrustScore(userId);
            }
        } catch (Exception ex) {
            logger.error("[RequestService] Error recalculating trust score for user {}: {}", userId, ex.getMessage());
        }
    }
}
