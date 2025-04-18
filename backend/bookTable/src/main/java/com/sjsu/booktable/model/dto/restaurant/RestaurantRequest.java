package com.sjsu.booktable.model.dto.restaurant;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RestaurantRequest {

    @NotNull
    @Valid
    private RestaurantDetailsRequest basicDetails;

    @NotEmpty
    @Valid
    private List<TableConfigurationDto> tableConfigurations;

    @NotEmpty
    @Valid
    private List<HoursDto> operatingHours;

    @NotEmpty
    @Valid
    private List<TimeSlotDto> timeSlots;

    @NotBlank
    private String mainPhotoUrl;

    private List<String> additionalPhotoUrls; // optional
}
