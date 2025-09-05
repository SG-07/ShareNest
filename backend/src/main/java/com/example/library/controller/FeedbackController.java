// src/main/java/com/example/library/controller/FeedbackController.java
package com.example.library.controller;

import com.example.library.dto.FeedbackDto;
import com.example.library.entity.Feedback;
import com.example.library.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submit(@AuthenticationPrincipal UserDetails user,
                                           @Valid @RequestBody FeedbackDto dto) {
        Long userId = Long.valueOf(user.getUsername()); // assuming username = id
        Feedback saved = feedbackService.submitFeedback(userId, dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Feedback>> listByUser(@PathVariable Long id) {
        List<Feedback> list = feedbackService.getByUser(id);
        return ResponseEntity.ok(list);
    }
}