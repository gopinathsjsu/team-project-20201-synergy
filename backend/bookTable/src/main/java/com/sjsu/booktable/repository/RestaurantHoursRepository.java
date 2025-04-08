package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.HoursDto;

import java.util.List;

public interface RestaurantHoursRepository {

    void insertHours(int restaurantId, List<HoursDto> hoursList);

    void deleteByRestaurantId(int restaurantId);
}
