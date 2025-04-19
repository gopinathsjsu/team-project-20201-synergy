package com.sjsu.booktable.model.dto.booking;

import com.sjsu.booktable.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

@Data
public class BookingRequestDTO {

    @NotNull
    private int restaurantId;

    @NotBlank
    private String customerId;

    @NotNull
    private Date bookingDate;

    @NotNull
    private Time bookingTime;

    @NotNull
    private int partySize;

//    private Timestamp createdAt;
//    private Timestamp updatedAt;
}
