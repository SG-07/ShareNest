package com.gangwarsatyam.sharenest.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnavailableDateRange {

    private LocalDate start;
    private LocalDate end;

}
