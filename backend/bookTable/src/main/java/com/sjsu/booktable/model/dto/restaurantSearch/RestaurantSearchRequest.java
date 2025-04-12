package com.sjsu.booktable.model.dto.restaurantSearch;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RestaurantSearchRequest {

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime time;

    @Min(1) @Max(20)
    private int partySize;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private String searchText;
}
