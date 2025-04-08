package com.sjsu.booktable.exception.restaurant;

import org.springframework.http.HttpStatus;

public class PhotoUploadException extends RestaurantException {

    public PhotoUploadException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }

}
