// src/main/java/com/example/library/entity/Feedback.java
package com.example.library.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrow_id", nullable = false)
    private Borrow borrow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rater_id", nullable = false)
    private User rater;          // the user who gave the rating

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ratee_id", nullable = false)
    private User ratee;          // the user who is being rated

    @Column(nullable = false)
    private Integer rating;      // 1–5

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}