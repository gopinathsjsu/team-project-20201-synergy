package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.dto.restaurant.RestaurantDetailsResponse;
import com.sjsu.booktable.model.dto.restaurant.RestaurantRequest;
import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.model.dto.restaurantSearch.NearbyRestaurantRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchResponse;

public interface RestaurantService {

    RestaurantResponse addRestaurant(RestaurantRequest restaurantRequest, String managerId);

    RestaurantResponse updateRestaurant(int restaurantId, RestaurantRequest request, String managerId);

    RestaurantSearchResponse searchRestaurants(RestaurantSearchRequest searchRequest);

    RestaurantSearchResponse getNearbyRestaurants(NearbyRestaurantRequest request);

    RestaurantSearchResponse fetchRestaurantsByManager(String managerId);

    RestaurantDetailsResponse fetchRestaurantDetails(int restaurantId);

}
