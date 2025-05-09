package com.sjsu.booktable.model.dto.restaurantSearch;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NearbyRestaurantRequest {

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @Min(1) @Max(50)
    private Integer radius = 15;
} 