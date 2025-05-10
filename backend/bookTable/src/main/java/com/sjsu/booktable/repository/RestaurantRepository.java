package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.RestaurantDetailsRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import com.sjsu.booktable.model.entity.Restaurant;

import java.time.LocalDateTime;
import java.util.List;

public interface RestaurantRepository {

    Restaurant findById(int id);

    List<Restaurant> findByApproved(boolean approved);

    void updateRestaurant(Restaurant restaurant); // Note: updates an existing Restaurant entity

    void deleteById(int id); // Soft delete

    List<Restaurant> getMostPopularRestaurants(LocalDateTime startDate, LocalDateTime endDate);

    int getTotalReservations(LocalDateTime startDate, LocalDateTime endDate);

    List<Restaurant> findAllNonDeleted();


    int addRestaurantDetails(RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl, String managerId);

    void updateRestaurantDetails(int id, RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl);

    List<RestaurantSearchDetails> searchRestaurants(double longitude, double latitude, String searchText);

    List<RestaurantSearchDetails> findNearbyRestaurants(double longitude, double latitude, int radiusInKm);

    List<RestaurantSearchDetails> findByManagerId(String managerId);

}