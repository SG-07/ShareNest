package com.gangwarsatyam.sharenest.service;

import com.gangwarsatyam.sharenest.dto.TrustScoreDto;
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
        User user = userRepo.findById(Long.parseLong(userId)).orElseThrow(() -> new RuntimeException("User not found"));

        int lendCount = requestRepo.findByOwnerId(user.getId().toString()).stream()
                .filter(r -> "ACCEPTED".equals(r.getStatus()))
                .mapToInt(r -> 1).sum();
        int borrowCount = requestRepo.findByBorrowerId(user.getId().toString()).stream()
                .filter(r -> "ACCEPTED".equals(r.getStatus()))
                .mapToInt(r -> 1).sum();

        double score = (lendCount + borrowCount) > 0 ?
                (double) lendCount / (lendCount + borrowCount) : 0.0;

        user.setLendCount(lendCount);
        user.setBorrowCount(borrowCount);
        user.setTrustScore(score);
        userRepo.save(user);

        return new TrustScoreDto(user.getId().toString(), score, lendCount, borrowCount);
    }
}