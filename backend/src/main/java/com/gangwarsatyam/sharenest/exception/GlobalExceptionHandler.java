package com.gangwarsatyam.sharenest.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    /** Generic error response payload */
    @Data
    @AllArgsConstructor
    public static class ErrorResponse {
        private Instant timestamp;
        private int status;
        private String error;            // e.g. "Not Found"
        private String message;
        private String path;
        private String errorCode;        // optional application specific code
        private Map<String, String> validationErrors; // optional field errors
    }

    /**
     * Handle ServiceException (our custom unchecked exceptions).
     */
    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> handleServiceException(
            ServiceException ex,
            org.springframework.web.context.request.WebRequest request) {

        HttpStatus status = HttpStatus.resolve(ex.getStatusCode());
        if (status == null) status = HttpStatus.INTERNAL_SERVER_ERROR;

        // Debug log
        System.out.println("[GlobalExceptionHandler] ServiceException: " + ex.getMessage());

        ErrorResponse err = new ErrorResponse(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getDescription(false).replace("uri=", ""),
                ex.getErrorCode(),
                null);

        return new ResponseEntity<>(err, status);
    }

    /**
     * Handle validation errors from @Valid annotations.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex,
            org.springframework.web.context.request.WebRequest request) {

        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (existing, replacement) -> existing
                ));

        // Debug log
        System.out.println("[GlobalExceptionHandler] Validation failed: " + errors);

        ErrorResponse err = new ErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Validation failed",
                request.getDescription(false).replace("uri=", ""),
                "VALIDATION_ERROR",
                errors);

        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle malformed JSON or bad request body.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleNotReadable(
            HttpMessageNotReadableException ex,
            org.springframework.web.context.request.WebRequest request) {

        // Debug log
        System.out.println("[GlobalExceptionHandler] Malformed JSON: " + ex.getMessage());

        ErrorResponse err = new ErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Malformed JSON request",
                request.getDescription(false).replace("uri=", ""),
                "BAD_JSON",
                null);

        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    /**
     * Fallback for any unhandled exception.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(
            Exception ex,
            org.springframework.web.context.request.WebRequest request) {

        // Debug log
        System.out.println("[GlobalExceptionHandler] Unhandled exception: " + ex);

        ErrorResponse err = new ErrorResponse(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "An unexpected error occurred",
                request.getDescription(false).replace("uri=", ""),
                "INTERNAL_ERROR",
                null);

        ex.printStackTrace(); // keep for now, swap with proper logger later

        return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
