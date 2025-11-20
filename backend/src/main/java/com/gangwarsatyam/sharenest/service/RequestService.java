package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.RequestDto;
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

import java.time.LocalDate;
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
    private final TrustScoreService trustScoreService;


    public Request submitRequest(RequestDto dto, String borrowerId) {

        if (debug) logger.debug("Submitting borrow request for item {} by borrower {}", dto.getItemId(), borrowerId);

        Item item = itemRepo.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        User borrower = userRepo.findById(borrowerId)
                .orElseThrow(() -> new RuntimeException("Borrower not found"));

        // Convert String -> LocalDate safely
        LocalDate startDate = dto.getStartDate() != null ? LocalDate.parse(dto.getStartDate()) : null;
        LocalDate endDate   = dto.getEndDate() != null ? LocalDate.parse(dto.getEndDate()) : null;

        Request req = Request.builder()
                .itemId(dto.getItemId())
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
                .pricePerDay(dto.getPricePerDay())
                .subtotal(dto.getSubtotal())

                .discount(dto.getDiscount())
                .tax(dto.getTax())
                .serviceFee(dto.getServiceFee())
                .deliveryFee(dto.getDeliveryFee())

                .totalPrice(dto.getTotalPrice())
                .message(dto.getMessage())

                .imageUrls(dto.getImageUrls())
                .build();

        Request saved = requestRepo.save(req);

        logger.info("Borrow request {} submitted by {} for item {}", saved.getId(), borrowerId, dto.getItemId());
        return saved;
    }


    public List<Request> getRequestsByBorrower(String borrowerId) {
        if (debug) logger.debug("Fetching requests for borrower {}", borrowerId);
        return requestRepo.findByBorrowerId(borrowerId);
    }

    public List<Request> getRequestsByOwner(String ownerId) {
        if (debug) logger.debug("Fetching requests received by owner {}", ownerId);
        return requestRepo.findByOwnerId(ownerId);
    }


    public void cancelRequest(String requestId, String borrowerId) {

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

        logger.info("Request {} cancelled by borrower {}", requestId, borrowerId);

        safeRecalculateTrust(req.getOwnerId());
        safeRecalculateTrust(req.getBorrowerId());
    }


    public void acceptRequest(String requestId, String ownerId) {

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You can accept only your own items' requests");
        }

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be accepted");
        }

        req.setStatus(RequestStatus.ACCEPTED);
        requestRepo.save(req);

        Item item = itemRepo.findById(req.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setAvailable(false);
        itemRepo.save(item);

        logger.info("Request {} accepted by owner {}", requestId, ownerId);

        safeRecalculateTrust(req.getOwnerId());
        safeRecalculateTrust(req.getBorrowerId());
    }


    public void declineRequest(String requestId, String ownerId) {

        Request req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You can decline only your own requests");
        }

        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be declined");
        }

        req.setStatus(RequestStatus.REJECTED);
        requestRepo.save(req);

        logger.info("Request {} rejected by owner {}", requestId, ownerId);

        safeRecalculateTrust(req.getOwnerId());
        safeRecalculateTrust(req.getBorrowerId());
    }


    private void safeRecalculateTrust(String userId) {
        try {
            if (userId != null) {
                trustScoreService.calculateTrustScore(userId);
            }
        } catch (Exception ex) {
            logger.error("Trust score update failed for {}: {}", userId, ex.getMessage());
        }
    }
}
