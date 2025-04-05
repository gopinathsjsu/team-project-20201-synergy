package com.sjsu.booktable.exception.auth;

import org.springframework.http.HttpStatus;

public class OtpVerificationFailedException extends AuthException {

    public OtpVerificationFailedException(String message) {
        super("OTP verification failed: " + message, HttpStatus.UNAUTHORIZED);
    }
}
