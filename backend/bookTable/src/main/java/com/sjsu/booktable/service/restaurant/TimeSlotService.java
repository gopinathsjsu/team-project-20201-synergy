package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.TimeSlotDto;

import java.util.List;

public interface TimeSlotService {

    void addTimeSlots(int restaurantId, List<TimeSlotDto> slots);

    void replaceTimeSlots(int restaurantId, List<TimeSlotDto> slots);

    TimeSlotDto getTimeSlotsForRestaurantAndDay(int restaurantId, int dayOfWeek);

    List<TimeSlotDto> getTimeSlotsForRestaurant(int restaurantId);
}
