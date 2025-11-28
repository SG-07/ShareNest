package com.gangwarsatyam.sharenest.dto;

import com.gangwarsatyam.sharenest.model.Item;
import com.gangwarsatyam.sharenest.model.Request;
import com.gangwarsatyam.sharenest.model.RequestStatus;
import com.gangwarsatyam.sharenest.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BorrowedItemResponse {

    private String requestId;
    private String itemId;
    private String itemName;

    private String ownerId;
    private String ownerName;

    private LocalDate startDate;
    private LocalDate endDate;
    private RequestStatus status;

    private double pricePerDay;
    private double securityDeposit;
    private double deliveryCharge;
    private double totalPrice;

    private List<String> imageUrls;

    public static BorrowedItemResponse from(Item item, Request req, User owner) {
        BorrowedItemResponse r = new BorrowedItemResponse();

        r.requestId = req.getId();
        r.itemId = item.getId();
        r.itemName = item.getName();

        r.ownerId = owner.getId();
        r.ownerName = owner.getName();

        r.startDate = req.getStartDate();
        r.endDate = req.getEndDate();
        r.status = req.getStatus();

        r.pricePerDay = item.getPricePerDay();
        r.securityDeposit = item.getSecurityDeposit();
        r.deliveryCharge = item.getDeliveryCharge();

        long rentalDays = ChronoUnit.DAYS.between(r.startDate, r.endDate);
        if (rentalDays <= 0) rentalDays = 1;

        r.totalPrice =
                (rentalDays * r.pricePerDay) +
                        r.securityDeposit +
                        r.deliveryCharge;

        r.imageUrls = item.getImageUrls();

        return r;
    }
}
