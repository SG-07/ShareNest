package com.example.library.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record BookCreateDto(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Author is required")
        String author,

        @NotBlank(message = "ISBN is required")
        String isbn,

        @NotNull(message = "Price is required")
        Double price,

        @Size(max = 500, message = "Description is too long")
        String description,

        @NotNull(message = "Category list cannot be null")
        List<String> categories
) {}