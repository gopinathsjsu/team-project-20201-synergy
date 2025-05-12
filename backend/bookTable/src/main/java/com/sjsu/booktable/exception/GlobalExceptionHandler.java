package com.sjsu.booktable.exception;

import com.sjsu.booktable.exception.auth.InvalidRequestException;
import com.sjsu.booktable.exception.auth.LogoutFailedException;
import com.sjsu.booktable.exception.auth.OtpSendFailedException;
import com.sjsu.booktable.exception.auth.OtpVerificationFailedException;
import com.sjsu.booktable.exception.booking.BookingNotFoundException;
import com.sjsu.booktable.exception.restaurant.GeocodingException;
import com.sjsu.booktable.exception.restaurant.InvalidRestaurantRequestException;
import com.sjsu.booktable.exception.restaurant.PhotoUploadException;
import com.sjsu.booktable.model.dto.BTResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BTResponse<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Validation failed");
        return ResponseEntity.badRequest().body(BTResponse.failure(errorMessage));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BTResponse<String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<BTResponse<String>> handleInvalidRequest(InvalidRequestException ex) {
        return ResponseEntity.status(ex.getStatus()).body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(OtpSendFailedException.class)
    public ResponseEntity<BTResponse<String>> handleOtpSendFailed(OtpSendFailedException ex) {
        return ResponseEntity.status(ex.getStatus()).body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(OtpVerificationFailedException.class)
    public ResponseEntity<BTResponse<String>> handleOtpVerificationFailed(OtpVerificationFailedException ex) {
        return ResponseEntity.status(ex.getStatus()).body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(LogoutFailedException.class)
    public ResponseEntity<BTResponse<String>> handleLogoutFailed(LogoutFailedException ex) {
        return ResponseEntity.status(ex.getStatus()).body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(InvalidRestaurantRequestException.class)
    public ResponseEntity<BTResponse<String>> handleInvalidRestaurantRequest(InvalidRestaurantRequestException ex) {
        return ResponseEntity.status(ex.getStatus()).body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(GeocodingException.class)
    public ResponseEntity<BTResponse<String>> handleGeocodingException(GeocodingException ex) {
        return ResponseEntity.status(ex.getStatus()).body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(PhotoUploadException.class)
    public ResponseEntity<BTResponse<String>> handlePhotoUploadException(PhotoUploadException ex) {
        return ResponseEntity.status(ex.getStatus()).body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<BTResponse<String>> handleBookingNotFoundException(BookingNotFoundException ex) {
        return ResponseEntity.status(ex.getStatus()).body(BTResponse.failure(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<BTResponse<String>> handleGenericException(Exception ex) {
        return ResponseEntity.internalServerError().body(BTResponse.failure("An unexpected error occurred: " + ex.getMessage()));
    }


}
