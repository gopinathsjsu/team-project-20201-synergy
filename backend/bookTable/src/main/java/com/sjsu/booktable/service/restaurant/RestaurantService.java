package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.RestaurantRequest;
import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;

public interface RestaurantService {

    RestaurantResponse addRestaurant(RestaurantRequest restaurantRequest, int managerId);

    RestaurantResponse updateRestaurant(int restaurantId, RestaurantRequest request, int managerId);

}
