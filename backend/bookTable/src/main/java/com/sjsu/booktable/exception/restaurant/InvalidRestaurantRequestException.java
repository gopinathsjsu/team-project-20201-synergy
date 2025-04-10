package com.sjsu.booktable.exception.restaurant;

import org.springframework.http.HttpStatus;

public class InvalidRestaurantRequestException extends RestaurantException {

    public InvalidRestaurantRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

}
