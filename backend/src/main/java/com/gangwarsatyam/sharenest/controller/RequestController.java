package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.dto.RequestDto;
import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.service.RequestService;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private static final Logger logger = LoggerFactory.getLogger(RequestController.class);

    private final RequestService requestService;
    private final UserRepository userRepository;

    @Value("${app.debug:false}")
    private boolean debug;

    // ----------------------------------------------------
    //  SUBMIT REQUEST
    // ----------------------------------------------------
    @PostMapping
    public ResponseEntity<Request> submitRequest(
            @RequestBody RequestDto dto,
            Authentication auth
    ) {
        String borrowerId = extractUserId(auth);

        if (debug) logger.debug("[RequestController] Submit request for item {} by user {}",
                dto.getItemId(), borrowerId);

        Request saved = requestService.submitRequest(dto, borrowerId);
        return ResponseEntity.ok(saved);
    }

    // ----------------------------------------------------
    //  CANCEL REQUEST (Borrower)
    // ----------------------------------------------------
    @PostMapping("/{requestId}/cancel")
    public ResponseEntity<Void> cancelRequest(
            @PathVariable String requestId,
            Authentication auth
    ) {
        String borrowerId = extractUserId(auth);

        if (debug) logger.debug("[RequestController] Cancel request {} by borrower {}", requestId, borrowerId);

        requestService.cancelRequest(requestId, borrowerId);
        return ResponseEntity.noContent().build();
    }

    // ----------------------------------------------------
    //  GET MY SENT REQUESTS (Borrower)
    // ----------------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<List<Request>> myRequests(Authentication auth) {
        String borrowerId = extractUserId(auth);

        if (debug) logger.debug("[RequestController] Fetching sent (my) requests for borrower {}", borrowerId);

        return ResponseEntity.ok(requestService.getRequestsByBorrower(borrowerId));
    }

    // ----------------------------------------------------
    //  GET REQUESTS RECEIVED (Owner)
    // ----------------------------------------------------
    @GetMapping("/received")
    public ResponseEntity<List<Request>> receivedRequests(Authentication auth) {
        String ownerId = extractUserId(auth);

        if (debug) logger.debug("[RequestController] Fetching received requests for owner {}", ownerId);

        return ResponseEntity.ok(requestService.getRequestsByOwner(ownerId));
    }

    // ----------------------------------------------------
    //  ACCEPT REQUEST (Owner)
    // ----------------------------------------------------
    @PostMapping("/{requestId}/accept")
    public ResponseEntity<Void> acceptRequest(
            @PathVariable String requestId,
            Authentication auth
    ) {
        String ownerId = extractUserId(auth);

        if (debug) logger.debug("[RequestController] Owner {} accepting request {}", ownerId, requestId);

        requestService.acceptRequest(requestId, ownerId);
        return ResponseEntity.noContent().build();
    }

    // ----------------------------------------------------
    //  DECLINE REQUEST (Owner)
    // ----------------------------------------------------
    @PostMapping("/{requestId}/decline")
    public ResponseEntity<Void> declineRequest(
            @PathVariable String requestId,
            Authentication auth
    ) {
        String ownerId = extractUserId(auth);

        if (debug) logger.debug("[RequestController] Owner {} declining request {}", ownerId, requestId);

        requestService.declineRequest(requestId, ownerId);
        return ResponseEntity.noContent().build();
    }

    // ----------------------------------------------------
    // Utility: Extract Authenticated User ID
    // ----------------------------------------------------
    private String extractUserId(Authentication auth) {
        if (auth == null) {
            throw new RuntimeException("Authentication required.");
        }

        String username = auth.getName();

        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
