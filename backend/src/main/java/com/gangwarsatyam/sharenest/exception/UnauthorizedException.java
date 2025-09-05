package com.gangwarsatyam.sharenest.exception;

/**
 * Thrown when authentication fails.
 */
public class UnauthorizedException extends ServiceException {

    public UnauthorizedException(String message) {
        super(message, 401, "UNAUTHORIZED");
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause, 401, "UNAUTHORIZED");
    }
}