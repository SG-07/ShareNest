package com.gangwarsatyam.sharenest.controller;

import com.gangwarsatyam.sharenest.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @PostMapping("/{id}/request")
    public ResponseEntity<Request> requestToBorrow(
            @PathVariable("id") String itemId,
            @AuthenticationPrincipal User borrower) {

        Request req = requestService.submitRequest(itemId, borrower.getId().toString());
        return ResponseEntity.ok(req);
    }

    @DeleteMapping("/request/{requestId}")
    public ResponseEntity<Void> cancelRequest(
            @PathVariable String requestId,
            @AuthenticationPrincipal User borrower) {

        requestService.cancelRequest(requestId, borrower.getId().toString());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<Request>> myRequests(@AuthenticationPrincipal User borrower) {
        return ResponseEntity.ok(requestService.getRequestsByBorrower(borrower.getId().toString()));
    }
}