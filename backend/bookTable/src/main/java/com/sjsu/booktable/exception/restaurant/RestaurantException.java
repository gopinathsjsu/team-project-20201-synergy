package com.sjsu.booktable.exception.restaurant;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class RestaurantException extends RuntimeException {

    private final HttpStatus status;

    public RestaurantException(String message, HttpStatus httpStatus) {
        super(message);
        this.status = httpStatus;
    }

    public RestaurantException(String message, HttpStatus httpStatus, Throwable cause) {
        super(message, cause);
        this.status = httpStatus;
    }
}
