package com.gangwarsatyam.sharenest.exception;

/**
 * Thrown when a logged‑in user is not allowed to perform an operation.
 */
public class ForbiddenException extends ServiceException {

    public ForbiddenException(String message) {
        super(message, 403, "FORBIDDEN");
    }

    public ForbiddenException(String message, Throwable cause) {
        super(message, cause, 403, "FORBIDDEN");
    }
}