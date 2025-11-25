package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.RequestDto;
import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.RequestStatus;
import com.gangwarsatyam.sharenest.model.UnavailableDateRange;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.ItemRepository;
import com.gangwarsatyam.sharenest.repository.RequestRepository;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private static final Logger log = LoggerFactory.getLogger(RequestService.class);

    @Value("${app.debug:false}")
    private boolean debug;

    private final RequestRepository requestRepo;
    private final ItemRepository itemRepo;
    private final UserRepository userRepo;
    private final TrustScoreService trustScoreService;

    // -------------------------------------------------------------------------
    // SUBMIT REQUEST
    // -------------------------------------------------------------------------
    public Request submitRequest(RequestDto dto, String borrowerId) {

        debug("Submitting request: itemId={}, borrower={}", dto.getItemId(), borrowerId);

        Item item = itemRepo.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found: " + dto.getItemId()));

        if (item.getOwnerId().equals(borrowerId)) {
            throw new RuntimeException("You cannot request your own item.");
        }

        User borrower = userRepo.findById(borrowerId)
                .orElseThrow(() -> new RuntimeException("Borrower not found: " + borrowerId));

        // --- validate rental dates ---
        LocalDate startDate = parseSafe(dto.getStartDate());
        LocalDate endDate = parseSafe(dto.getEndDate());

        debug("Parsed dates: start={}, end={}", startDate, endDate);

        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new RuntimeException("End date cannot be before start date.");
        }

        // Build request
        Request req = Request.builder()
                .itemId(item.getId())
                .borrowerId(borrowerId)
                .ownerId(item.getOwnerId())
                .status(RequestStatus.PENDING)
                .startDate(startDate)
                .endDate(endDate)
                .days(dto.getDays())
                .quantity(dto.getQuantity())
                .deliveryOption(dto.getDeliveryOption())
                .paymentMethod(dto.getPaymentMethod())
                .securityDeposit(dto.getSecurityDeposit())
                .message(dto.getMessage())
                .imageUrls(dto.getImageUrls())
                .build();

        Request saved = requestRepo.save(req);

        log.info("Request {} submitted by borrower {} for item {}", saved.getId(), borrowerId, item.getId());
        return saved;
    }

    // -------------------------------------------------------------------------
    // VIEW REQUESTS
    // -------------------------------------------------------------------------
    public List<Request> getRequestsByBorrower(String borrowerId) {
        debug("Fetching requests by borrower {}", borrowerId);
        return requestRepo.findByBorrowerId(borrowerId);
    }

    public List<Request> getRequestsByOwner(String ownerId) {
        debug("Fetching requests for owner {}", ownerId);
        return requestRepo.findByOwnerId(ownerId);
    }

    // -------------------------------------------------------------------------
    // CANCEL REQUEST
    // -------------------------------------------------------------------------
    public void cancelRequest(String requestId, String borrowerId) {

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        if (!req.getBorrowerId().equals(borrowerId)) {
            throw new RuntimeException("You can cancel only your own requests");
        }

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be cancelled");
        }

        req.setStatus(RequestStatus.CANCELLED);
        requestRepo.save(req);

        log.info("Request {} cancelled by borrower {}", requestId, borrowerId);

        updateTrustSafe(req);
    }

    // -------------------------------------------------------------------------
    // ACCEPT REQUEST
    // -------------------------------------------------------------------------
    public void acceptRequest(String requestId, String ownerId) {

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        if (!req.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You can accept only your own item's requests");
        }

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be accepted");
        }

        req.setStatus(RequestStatus.ACCEPTED);
        requestRepo.save(req);

        // ===== UPDATE BOOKED DATE RANGES IN ITEM =====
        Item item = itemRepo.findById(req.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found: " + req.getItemId()));

        List<UnavailableDateRange> ranges = item.getNotAvailable();
        if (ranges == null) ranges = new ArrayList<>();

        ranges.add(new UnavailableDateRange(
                req.getStartDate(),
                req.getEndDate()
        ));

        item.setNotAvailable(ranges);

        item.setAvailable(true);

        itemRepo.save(item);

        log.info("Request {} accepted by owner {} and dates added to item", requestId, ownerId);

        updateTrustSafe(req);
    }

    // -------------------------------------------------------------------------
    // DECLINE REQUEST
    // -------------------------------------------------------------------------
    public void declineRequest(String requestId, String ownerId) {

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        if (!req.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You can reject only your own item's requests");
        }

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be rejected");
        }

        req.setStatus(RequestStatus.REJECTED);
        requestRepo.save(req);

        log.info("Request {} rejected by owner {}", requestId, ownerId);

        updateTrustSafe(req);
    }

    // -------------------------------------------------------------------------
    // UTILS
    // -------------------------------------------------------------------------
    private LocalDate parseSafe(String dateStr) {
        try {
            return dateStr != null ? LocalDate.parse(dateStr) : null;
        } catch (Exception ex) {
            throw new RuntimeException("Invalid date format: " + dateStr);
        }
    }

    private void debug(String msg, Object... args) {
        if (debug) log.debug(msg, args);
    }

    private void updateTrustSafe(Request req) {
        try {
            trustScoreService.calculateTrustScore(req.getOwnerId());
            trustScoreService.calculateTrustScore(req.getBorrowerId());
        } catch (Exception ex) {
            log.error("Failed to update trust score: {}", ex.getMessage());
        }
    }
}
