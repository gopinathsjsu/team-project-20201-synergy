package com.sjsu.booktable.model.dto.restaurant;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RestaurantDetailsResponse {

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
    private String mainPhotoUrl; // s3 keys
    // Additional photos from the photos table
    private List<String> additionalPhotoUrls; // s3 keys
    private List<TableConfigurationDto> tableConfigurations; // List of table configurations
    // Operating hours as defined by HoursDTO for each day
    private List<HoursDto> operatingHours;
    // Specific time slots as defined by TimeSlotDTO for each day
    private List<TimeSlotDto> timeSlots;
    private boolean approved;

}
