package com.gangwarsatyam.sharenest.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception thrown when the client sends an unsupported Media Type
 * (for example, Content-Type not supported by the API).
 */
@ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
public class HttpMediaTypeNotSupportedException extends RuntimeException {

    public HttpMediaTypeNotSupportedException(String message) {
        super(message);
    }

    public HttpMediaTypeNotSupportedException(String message, Throwable cause) {
        super(message, cause);
    }
}
