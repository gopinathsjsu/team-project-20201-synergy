package com.sjsu.booktable.model.enums;

import lombok.Getter;

@Getter
public enum Role {
    CUSTOMER("Customer"),
    RESTAURANT_MANAGER("RestaurantManager"),
    ADMIN("Admin");

    private final String name;

    Role(String name) {
        this.name = name;
    }
}
