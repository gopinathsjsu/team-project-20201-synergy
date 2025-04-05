package com.sjsu.booktable.model.enums;

import lombok.Getter;

@Getter
public enum OTPIdentifier {
    EMAIL("email"),
    PHONE("phone");

    private final String name;

    OTPIdentifier(String name) {
        this.name = name;
    }

    public static OTPIdentifier fromValue(String value) {
        for (OTPIdentifier identifier : OTPIdentifier.values()) {
            if (identifier.getName().equalsIgnoreCase(value)) {
                return identifier;
            }
        }
        throw new IllegalArgumentException("Invalid OTP identifier: " + value);
    }
}
