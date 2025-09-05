// src/main/java/com/example/library/repository/FeedbackRepository.java
package com.example.library.repository;

import com.example.library.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByRateeId(Long userId);
}