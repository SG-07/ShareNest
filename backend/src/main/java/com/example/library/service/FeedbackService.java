// src/main/java/com/example/library/service/FeedbackService.java
package com.example.library.service;

import com.example.library.dto.FeedbackDto;
import com.example.library.entity.Borrow;
import com.example.library.entity.Feedback;
import com.example.library.entity.User;
import com.example.library.exception.BadRequestException;
import com.example.library.exception.ResourceNotFoundException;
import com.example.library.repository.BorrowRepository;
import com.example.library.repository.FeedbackRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepo;
    private final BorrowRepository borrowRepo;
    private final UserService userService;

    public FeedbackService(FeedbackRepository feedbackRepo,
                           BorrowRepository borrowRepo,
                           UserService userService) {
        this.feedbackRepo = feedbackRepo;
        this.borrowRepo = borrowRepo;
        this.userService = userService;
    }

    @Transactional
    public Feedback submitFeedback(Long borrowerId,
                                   FeedbackDto dto) {
        Borrow borrow = borrowRepo.findById(dto.borrowId())
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found"));

        if (!borrow.getUser().getId().equals(borrowerId)) {
            throw new BadRequestException("You can only rate your own borrowings");
        }

        User ratee = borrow.getItem().getOwner(); // or borrow.getUser() if rating the item owner
        Feedback feedback = new Feedback();
        feedback.setBorrow(borrow);
        feedback.setRater(userService.getById(borrowerId));
        feedback.setRatee(ratee);
        feedback.setRating(dto.rating());
        feedback.setComment(dto.comment());
        return feedbackRepo.save(feedback);
    }

    public List<Feedback> getByUser(Long userId) {
        return feedbackRepo.findByRateeId(userId);
    }
}