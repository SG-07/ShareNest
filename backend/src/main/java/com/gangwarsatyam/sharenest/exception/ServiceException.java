package com.gangwarsatyam.sharenest.exception;

/**
 * Base unchecked exception for the service layer.
 * All domain‑specific exceptions should extend this class.
 */
public class ServiceException extends RuntimeException {

    private final int statusCode; // HTTP status to map to
    private final String errorCode; // Application specific error code

    public ServiceException(String message, Throwable cause, int statusCode, String errorCode) {
        super(message, cause);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }

    public ServiceException(String message, int statusCode, String errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }

    public ServiceException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
        this.errorCode = "INTERNAL_ERROR";
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}