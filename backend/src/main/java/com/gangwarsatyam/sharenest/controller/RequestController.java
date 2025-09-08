package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.service.RequestService;
import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")   // ✅ better grouping
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    // ✅ Submit a borrow request
    @PostMapping("/{itemId}")
    public ResponseEntity<Request> requestToBorrow(
            @PathVariable String itemId,
            @AuthenticationPrincipal User borrower) {

        Request req = requestService.submitRequest(itemId, borrower.getId());
        return ResponseEntity.ok(req);
    }

    // ✅ Cancel a borrow request
    @PostMapping("/{requestId}/cancel")
    public ResponseEntity<Void> cancelRequest(
            @PathVariable String requestId,
            @AuthenticationPrincipal User borrower) {

        requestService.cancelRequest(requestId, borrower.getId());
        return ResponseEntity.noContent().build();
    }

    // ✅ Get all requests made by the logged-in borrower
    @GetMapping("/my")
    public ResponseEntity<List<Request>> myRequests(@AuthenticationPrincipal User borrower) {
        return ResponseEntity.ok(requestService.getRequestsByBorrower(borrower.getId()));
    }

    // ✅ Get all requests received by the logged-in owner
    @GetMapping("/received")
    public ResponseEntity<List<Request>> receivedRequests(@AuthenticationPrincipal User owner) {
        return ResponseEntity.ok(requestService.getRequestsByOwner(owner.getId()));
    }
}
