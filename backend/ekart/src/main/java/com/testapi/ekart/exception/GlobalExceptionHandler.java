package com.testapi.ekart.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.testapi.ekart.model.ApiResponse;



@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle resource not found exceptions (404)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ApiResponse error = ApiResponse.builder()
        		.status(false)
                .statusCode(HttpStatus.NOT_FOUND.value())
                .errors(List.of(ex.getMessage()))
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handle bad request exceptions (400)
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse> handleBadRequest(BadRequestException ex) {
    	 ApiResponse error = ApiResponse.builder()
         		.status(false)
                 .statusCode(HttpStatus.BAD_REQUEST.value())
                 .errors(List.of(ex.getMessage()))
                 .message(ex.getMessage())
                 .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle validation errors from @Valid annotations (400)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        
        ApiResponse error = ApiResponse.builder()
        		.status(false)
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .errors(List.of(ex.getMessage()))
                .message("Input validation failed")
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle invalid credentials during login (401)
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse> handleBadCredentials(BadCredentialsException ex) {
        ApiResponse error = ApiResponse.builder()
        		.status(false)
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .errors(List.of(ex.getMessage()))
                .message("Invalid email or password")
                .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Handle access denied exceptions (403) - wrong role
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDenied(AccessDeniedException ex) {
        ApiResponse error = ApiResponse.builder()
        		.status(false)
                .statusCode(HttpStatus.FORBIDDEN.value())
                .errors(List.of(ex.getMessage()))
                .message("You do not have permission to access this resource")
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    /**
     * Handle all other unexpected exceptions (500)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGenericException(Exception ex) {
        ApiResponse error = ApiResponse.builder()
        		.status(false)
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .errors(List.of(ex.getMessage()))
                .message("Internal server error")
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    // ---- Inner class for error response structure ----

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ErrorResponse {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;
        private Map<String, String> fieldErrors;
    }
}
