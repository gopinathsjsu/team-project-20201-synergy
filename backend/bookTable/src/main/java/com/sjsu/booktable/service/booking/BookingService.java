package com.sjsu.booktable.service.booking;

import com.sjsu.booktable.model.dto.booking.BookingConflictResponseDto;
import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.dto.booking.BookingResponseDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public interface BookingService {

    Map<LocalTime, Integer> getBookedCapacitiesForSlotsForRestaurant(int restaurantId, LocalDate reservationDate, List<LocalTime> timeSlots);
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO);
    BookingResponseDTO cancelBooking(int bookingId);
    List<BookingResponseDTO> getBookingsByCustomerId(String customerId);
    BookingConflictResponseDto checkConflictingBooking(String customerId, LocalDate bookingDate, LocalTime bookingTime);
    Map<Integer, Integer> getBookingCountsByRestaurantIds(List<Integer> restaurantIds, LocalDate date);
}
