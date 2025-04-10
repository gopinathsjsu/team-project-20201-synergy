package com.sjsu.booktable.exception.restaurant;

import org.springframework.http.HttpStatus;

public class GeocodingException extends RestaurantException {

    public GeocodingException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }

}
