package com.sjsu.booktable.service.email;

import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.entity.Booking;

public interface EmailService {

    boolean sendBookingConfirmationEmail(int bookingId, BookingRequestDTO bookingRequest);

    boolean sendBookingCancellationEmail(Booking booking,String recipientEmail);
} 