package com.sjsu.booktable.model.dto.restaurantSearch;

import lombok.Data;

import java.util.List;

@Data
public class RestaurantSearchDetails {

    private int id;
    private String name;
    private String cuisineType;
    private int costRating;
    private String address;
    private String mainPhotoUrl;
    private double distance;

    private List<String> availableTimeSlots;

}
