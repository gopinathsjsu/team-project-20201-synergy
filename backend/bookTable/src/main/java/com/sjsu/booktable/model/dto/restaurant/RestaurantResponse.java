package com.sjsu.booktable.model.dto.restaurant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestaurantResponse {
    private int id;
    private String name;
    private String cuisineType;
    private int costRating;
    private String description;
    private String contactPhone;
    private String addressLine;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String mainPhotoUrl;
    private boolean approved;
}