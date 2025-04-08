package com.sjsu.booktable.model.dto.restaurant;

import lombok.Data;

import java.util.List;

@Data
public class RestaurantDetailsResponse {

    private int id;
    private String name;
    private String cuisineType;
    private int costRating;
    private String description;
    private String contactPhone;
    // Full address can be sent as a pre-formatted string
    private String address; // e.g., "123 Main St, San Francisco, CA 94103"
    private String country;
    private String mainPhotoUrl;
    // Additional photos from the photos table
    private List<String> photos;
    // Operating hours as defined by HoursDTO for each day
    private List<HoursDto> operatingHours;
    // Specific time slots as defined by TimeSlotDTO for each day
    private List<TimeSlotDto> timeSlots;
    // Restaurant status using enum (ensures only valid statuses are used)
    private boolean approved;

}
