package com.example.library.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 400
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequest(BadRequestException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 400 – validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (oldValue, newValue) -> oldValue)); // keep first
        return buildResponse(HttpStatus.BAD_REQUEST,
                "Validation failed",
                fieldErrors);
    }

    // 422 – constraint violations (e.g. @Size on service layer)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> violations = ex.getConstraintViolations()
                .stream()
                .collect(Collectors.toMap(
                        v -> v.getPropertyPath().toString(),
                        v -> v.getMessage()));
        return buildResponse(HttpStatus.UNPROCESSABLE_ENTITY,
                "Constraint violations",
                violations);
    }

    // 401 – auth failures
    @ExceptionHandler({AuthenticationException.class, UnauthorizedException.class})
    public ResponseEntity<ApiError> handleAuthFailure(Exception ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    // 403 – forbidden
    @ExceptionHandler({AccessDeniedException.class, ForbiddenException.class})
    public ResponseEntity<ApiError> handleForbidden(Exception ex) {
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    // 500 – all other runtime exceptions
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(RuntimeException ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Unexpected server error: " + ex.getMessage());
    }

    // ---------- helpers ----------
    private ResponseEntity<ApiError> buildResponse(HttpStatus status, String message) {
        return buildResponse(status, message, null);
    }

    private ResponseEntity<ApiError> buildResponse(HttpStatus status,
                                                   String message,
                                                   Map<String, String> details) {
        ApiError error = new ApiError(status.value(), status.getReasonPhrase(),
                message, details);
        return new ResponseEntity<>(error, status);
    }

    // simple POJO for the JSON body
    public record ApiError(int status,
                           String error,
                           String message,
                           Map<String, String> details) {}
}