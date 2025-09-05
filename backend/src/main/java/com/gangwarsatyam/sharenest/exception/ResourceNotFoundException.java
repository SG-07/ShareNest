package com.gangwarsatyam.sharenest.exception;

/**
 * Thrown when a requested entity cannot be found.
 */
public class ResourceNotFoundException extends ServiceException {

    public ResourceNotFoundException(String message) {
        super(message, 404, "NOT_FOUND");
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause, 404, "NOT_FOUND");
    }
}