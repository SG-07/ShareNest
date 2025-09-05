package com.gangwarsatyam.sharenest.dto;

import lombok.*;

@Getter @Setter
@AllArgsConstructor
public class TrustScoreDto {
    private String userId;
    private double score;
    private int lendCount;
    private int borrowCount;
}