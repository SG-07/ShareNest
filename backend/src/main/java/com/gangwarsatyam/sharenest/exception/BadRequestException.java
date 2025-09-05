package com.gangwarsatyam.sharenest.exception;

/**
 * Thrown when the client sends invalid data.
 */
public class BadRequestException extends ServiceException {

    public BadRequestException(String message) {
        super(message, 400, "BAD_REQUEST");
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause, 400, "BAD_REQUEST");
    }
}