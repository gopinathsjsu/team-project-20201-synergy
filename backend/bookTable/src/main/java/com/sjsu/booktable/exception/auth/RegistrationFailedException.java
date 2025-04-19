package com.sjsu.booktable.exception.auth;

import org.springframework.http.HttpStatus;

public class RegistrationFailedException extends AuthException {

    public RegistrationFailedException(String message) {
        super("Registration Failed :: " + message, HttpStatus.BAD_REQUEST);
    }

}
