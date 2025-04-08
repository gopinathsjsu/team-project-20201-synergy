package com.sjsu.booktable.model.dto.restaurant;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class RestaurantRequest {

    @NotNull
    @Valid
    private RestaurantDetailsRequest basicDetails;

    @NotEmpty
    @Valid
    private List<TableRequest> tableConfigurations;

    @NotEmpty
    @Valid
    private List<HoursDto> operatingHours;

    @NotEmpty
    @Valid
    private List<TimeSlotDto> timeSlots;

    @NotNull
    private MultipartFile mainPhoto; // Main photo file upload

    private List<MultipartFile> additionalPhotos; // Optional additional photos
}
