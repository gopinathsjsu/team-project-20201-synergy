package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.TimeSlotDto;

import java.time.LocalTime;
import java.util.List;

public interface TimeSlotRepository {

    void insertTimeSlots(int restaurantId, List<TimeSlotDto> timeSlotDtos);

    void deleteByRestaurantId(int restaurantId);

    List<LocalTime> getTimeSlotsByRestaurantAndDay(int restaurantId, int dayOfWeek);
}
