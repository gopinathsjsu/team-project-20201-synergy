package com.sjsu.booktable.service.booking;

import com.sjsu.booktable.exception.booking.BookingNotFoundException;
import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.dto.booking.BookingResponseDTO;
import com.sjsu.booktable.model.entity.Booking;
import com.sjsu.booktable.model.enums.BookingStatus;
import com.sjsu.booktable.repository.BookingRepository;
import com.sjsu.booktable.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequest) {
        int bookingId = bookingRepository.saveBooking(bookingRequest);
        BookingResponseDTO bookingResponse = new BookingResponseDTO();
        if (bookingId > 0) {
            Booking booking = bookingRepository.findBookingById(bookingId);
            bookingResponse.setBooking(booking);
            bookingResponse.setStatus(booking.getStatus());
            try {
                boolean emailSent = emailService.sendBookingConfirmationEmail(bookingId, bookingRequest);
                bookingResponse.setEmailSent(emailSent);
                if (emailSent) {
                    log.info("Booking confirmation email sent for booking ID: {}", bookingId);
                } else {
                    log.warn("Failed to send booking confirmation email for booking ID: {}", bookingId);
                }
            } catch (Exception e) {
                log.error("Error sending booking confirmation email", e);
            }
        }

        return bookingResponse;
    }

    @Override
    public BookingResponseDTO cancelBooking(int bookingId) {
        Booking booking = bookingRepository.findBookingById(bookingId);
        if(booking == null){
            throw new BookingNotFoundException("Booking not found");
        }

        if(BookingStatus.CANCELLED.getStatus().equals(booking.getStatus())){
            throw new IllegalStateException("Booking is already cancelled");
        }

        int rowsAffected = bookingRepository.cancelBookingById(bookingId);
        if(rowsAffected == 0){
            throw new RuntimeException("Booking cancellation failed");
        }
        Booking updatedBooking = bookingRepository.findBookingById(bookingId);
        BookingResponseDTO bookingResponse = new BookingResponseDTO();
        bookingResponse.setBooking(updatedBooking);
        bookingResponse.setStatus(updatedBooking.getStatus());

        try {
            boolean emailSent = emailService.sendBookingCancellationEmail(updatedBooking, updatedBooking.getEmail());
            bookingResponse.setEmailSent(emailSent);
            if (emailSent) {
                log.info("Booking cancellation email sent for booking ID: {}", bookingId);
            } else {
                log.warn("Failed to send booking cancellation email for booking ID: {}", bookingId);
            }
        } catch (Exception e) {
            log.error("Error sending booking cancellation email", e);
        }

        return bookingResponse;
    }

    @Override
    public Map<LocalTime, Integer> getBookedCapacitiesForSlotsForRestaurant(int restaurantId, LocalDate reservationDate, List<LocalTime> timeSlots) {
        Map<LocalTime, Integer> slotBookedMap = new HashMap<>();

        if(CollectionUtils.isEmpty(timeSlots)){
            return slotBookedMap;
        }

        return bookingRepository.getBookedCapacityForTimeSlotsForRestaurant(restaurantId, reservationDate, timeSlots);
    }

}
