package com.sjsu.booktable.model.dto.booking;

import com.sjsu.booktable.model.entity.Booking;
import lombok.Data;

@Data
public class BookingConflictResponseDto {

    private boolean hasConflict;
    private Booking conflictingBooking;
}
