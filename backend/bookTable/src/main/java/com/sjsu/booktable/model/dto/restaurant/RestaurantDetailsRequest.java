package com.sjsu.booktable.model.dto.restaurant;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RestaurantDetailsRequest {

    @NotBlank
    private String name;

    private String cuisineType;

    @Min(1) @Max(4)
    private int costRating;

    private String description;

    @NotBlank
    private String contactPhone;

    @NotBlank
    private String addressLine;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String zipCode;

    @NotBlank
    private String country;

}
