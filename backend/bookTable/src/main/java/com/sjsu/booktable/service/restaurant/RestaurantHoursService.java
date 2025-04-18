package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.HoursDto;

import java.util.List;

public interface RestaurantHoursService {

    void addHours(int restaurantId, List<HoursDto> hours);

    void replaceHours(int restaurantId, List<HoursDto> hours);

    HoursDto getHoursForRestaurantAndDay(int restaurantId, int dayOfWeek);

    List<HoursDto> getHoursForRestaurant(int restaurantId);
}
