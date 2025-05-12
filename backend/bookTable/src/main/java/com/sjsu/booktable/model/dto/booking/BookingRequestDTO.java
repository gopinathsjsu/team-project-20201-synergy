package com.sjsu.booktable.model.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequestDTO {

    @NotNull
    private int restaurantId;

    @NotBlank
    private String restaurantName;

    private String customerId;

    @NotNull
    private LocalDate bookingDate;

    @NotNull
    private LocalTime bookingTime;

    @NotNull
    private int partySize;

    @NotBlank
    private String email;

    private Timestamp createdAt;
    private Timestamp updatedAt;
}
