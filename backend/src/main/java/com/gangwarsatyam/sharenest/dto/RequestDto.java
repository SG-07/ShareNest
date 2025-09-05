package com.gangwarsatyam.sharenest.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
public class RequestDto {
    @NotBlank private String itemId;
}