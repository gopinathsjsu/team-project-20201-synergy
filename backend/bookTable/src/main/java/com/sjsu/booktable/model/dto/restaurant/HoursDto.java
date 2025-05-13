package com.sjsu.booktable.model.dto.restaurant;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;

@Data
public class HoursDto {
    @Min(0) @Max(6)
    private int dayOfWeek;   // 0 = Sunday, 6 = Saturday

    private LocalTime openTime;  // Format: "HH:mm:ss", e.g. "11:00:00"

    private LocalTime closeTime; // Format: "HH:mm:ss", e.g. "22:00:00"
}
