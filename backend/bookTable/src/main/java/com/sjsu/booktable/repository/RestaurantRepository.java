package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.RestaurantDetailsRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import com.sjsu.booktable.model.entity.Restaurant;

import java.util.List;

public interface RestaurantRepository {

    Restaurant findById(int id);

    int addRestaurantDetails(RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl, int managerId);

    void updateRestaurantDetails(int id, RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl);

    void updateMainPhotoUrl(int id, String mainPhotoUrl);

    List<RestaurantSearchDetails> searchRestaurants(double longitude, double latitude, String searchText);

}
