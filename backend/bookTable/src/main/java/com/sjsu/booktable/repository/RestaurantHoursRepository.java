package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.HoursDto;
import com.sjsu.booktable.model.entity.RestaurantHours;

import java.util.List;

public interface RestaurantHoursRepository {

    void insertHours(int restaurantId, List<HoursDto> hoursList);

    void deleteByRestaurantId(int restaurantId);

    RestaurantHours getHoursByRestaurantAndDay(int restaurantId, int dayOfWeek);

    List<RestaurantHours> getHoursByRestaurantId(int restaurantId);
}
