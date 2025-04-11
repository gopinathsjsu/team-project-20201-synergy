package com.sjsu.booktable.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public interface BookingRepository {

    Map<LocalTime, Integer> getBookedCapacityForTimeSlotsForRestaurant(int restaurantId, LocalDate reservationDate, List<LocalTime> timeSlots);
}
