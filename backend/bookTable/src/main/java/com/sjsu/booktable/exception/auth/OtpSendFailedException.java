package com.sjsu.booktable.exception.auth;

import org.springframework.http.HttpStatus;

public class OtpSendFailedException extends AuthException {

    public OtpSendFailedException(String message) {
        super("Failed to send OTP: " + message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
