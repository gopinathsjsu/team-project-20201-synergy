package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.entity.Booking;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public interface BookingRepository {

    Map<LocalTime, Integer> getBookedCapacityForTimeSlotsForRestaurant(int restaurantId, LocalDate reservationDate, List<LocalTime> timeSlots);

    int saveBooking(BookingRequestDTO bookingRequest);

    int cancelBookingById(int bookingId);

    Booking findBookingById(int bookingId);
    
    List<Booking> findBookingsByCustomerId(String customerId);

    Booking findBookingWithConflict(String customerId, LocalDate reservationDate, LocalTime fromTime, LocalTime toTime);
    
    Map<Integer, Integer> getBookingCountsByRestaurantIds(List<Integer> restaurantIds, LocalDate date);
}
