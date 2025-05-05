package com.sjsu.booktable.service.admin;

import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import java.util.List;
import java.util.Map;

public interface AdminService {
    List<RestaurantResponse> getPendingRestaurants();
    RestaurantResponse approveRestaurant(String restaurantId);
    void removeRestaurant(String restaurantId);
    Map<String, Object> getReservationAnalytics();
    List<RestaurantResponse> getAllRestaurants();
} 