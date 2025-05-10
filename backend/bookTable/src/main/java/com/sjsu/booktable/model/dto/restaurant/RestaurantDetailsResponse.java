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
    private Double longitude;
    private Double latitude;
    private String mainPhotoUrl; // s3 keys
    private List<String> additionalPhotoUrls; // s3 keys
    private List<TableConfigurationDto> tableConfigurations;
    private List<HoursDto> operatingHours;
    private List<TimeSlotDto> timeSlots;
    private boolean approved;

}
