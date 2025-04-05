package com.sjsu.booktable.exception.auth;

import org.springframework.http.HttpStatus;

public class InvalidRequestException extends AuthException {

    public InvalidRequestException(String message) {
        super("Invalid request: " + message, HttpStatus.BAD_REQUEST);
    }
}
