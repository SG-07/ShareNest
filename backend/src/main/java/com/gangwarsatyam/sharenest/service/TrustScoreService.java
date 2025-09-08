package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.TrustScoreDto;
import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import com.gangwarsatyam.sharenest.repository.RequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrustScoreService {

    private final UserRepository userRepo;
    private final RequestRepository requestRepo;

    public TrustScoreDto calculateTrustScore(String userId) {
        // ✅ MongoDB: IDs are Strings, no parseLong
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ count lending (owner side)
        int lendCount = (int) requestRepo.findByOwnerId(user.getId())
                .stream()
                .filter(r -> "ACCEPTED".equals(r.getStatus()))
                .count();

        // ✅ count borrowing (borrower side)
        int borrowCount = (int) requestRepo.findByBorrowerId(user.getId())
                .stream()
                .filter(r -> "ACCEPTED".equals(r.getStatus()))
                .count();

        // ✅ trust score = ratio of lending to total
        double score = (lendCount + borrowCount) > 0
                ? (double) lendCount / (lendCount + borrowCount)
                : 0.0;

        // ✅ update and save user
        user.setLendCount(lendCount);
        user.setBorrowCount(borrowCount);
        user.setTrustScore(score);
        userRepo.save(user);

        return new TrustScoreDto(user.getId(), score, lendCount, borrowCount);
    }
}
