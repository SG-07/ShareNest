// src/main/java/com/example/library/dto/FeedbackDto.java
package com.example.library.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FeedbackDto(
        @NotNull(message = "Borrow ID is required") Long borrowId,

        @Min(value = 1, message = "Rating must be between 1 and 5")
        @Max(value = 5, message = "Rating must be between 1 and 5")
        Integer rating,

        @Size(max = 1000, message = "Comment is too long")
        String comment
) {}