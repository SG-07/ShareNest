package com.gangwarsatyam.sharenest.model;

public enum RequestStatus {
    PENDING,        // Request sent but not seen/approved yet
    ACCEPTED,       // Owner accepted the request
    REJECTED,       // Owner rejected the request
    CANCELLED,      // Borrower cancelled before approval
    ONGOING,        // Item handed over / rental started
    RETURNED        // Rental completed, item returned
}
