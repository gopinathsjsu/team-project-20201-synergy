package com.sjsu.booktable.exception.auth;

import org.springframework.http.HttpStatus;

public class LogoutFailedException extends AuthException {

    public LogoutFailedException(String message) {
        super("Logout failed: " + message, HttpStatus.UNAUTHORIZED);
    }
}
