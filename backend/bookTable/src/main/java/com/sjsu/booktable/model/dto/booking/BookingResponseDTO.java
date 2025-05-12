package com.sjsu.booktable.model.dto.booking;

import com.sjsu.booktable.model.entity.Booking;
import lombok.Data;

@Data
public class BookingResponseDTO {
    private boolean emailSent;
    private Booking booking;
    private String status;
}
