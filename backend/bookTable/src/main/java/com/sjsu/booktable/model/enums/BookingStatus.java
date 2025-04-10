package com.sjsu.booktable.model.enums;

import lombok.Getter;

@Getter
public enum BookingStatus {

    CONFIRMED("confirmed"),
    CANCELLED("cancelled");

    private final String status;

    BookingStatus(String status) {
        this.status = status;
    }
}
