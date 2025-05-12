package com.sjsu.booktable.exception.booking;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BookingNotFoundException extends RuntimeException {

    private final HttpStatus status;

    public BookingNotFoundException(String message) {
        super(message);
        this.status = HttpStatus.NOT_FOUND;
    }

    public BookingNotFoundException(String message, Throwable cause) {
        super(message, cause);
        this.status = HttpStatus.NOT_FOUND;
    }

    public BookingNotFoundException(Throwable cause) {
        super(cause);
        this.status = HttpStatus.NOT_FOUND;
    }
}
