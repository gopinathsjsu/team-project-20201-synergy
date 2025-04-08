package com.sjsu.booktable.model.dto.restaurant;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class TimeSlotDto {

    @Min(0) @Max(6)
    private int dayOfWeek;   // 0 = Sunday, 6 = Saturday

    @NotEmpty
    private List<LocalTime> times; // Each time in "HH:mm:ss" format, e.g. "18:15:00"
}
