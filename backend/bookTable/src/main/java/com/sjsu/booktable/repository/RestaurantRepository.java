package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.RestaurantDetailsRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import com.sjsu.booktable.model.entity.Restaurant;
import java.time.LocalDateTime;
import java.util.List;
<<<<<<< HEAD

import java.util.List;
=======
>>>>>>> 2768e3a2c3df43ce0bd132a2afb78d04a824772d

public interface RestaurantRepository {

    Restaurant findById(int id);

    List<Restaurant> findByApproved(boolean approved);

    void updateRestaurant(Restaurant restaurant);

    void deleteById(int id);

    List<Restaurant> getMostPopularRestaurants(LocalDateTime startDate, LocalDateTime endDate);

    int getTotalReservations(LocalDateTime startDate, LocalDateTime endDate);

    int addRestaurantDetails(RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl, int managerId);

    void updateRestaurantDetails(int id, RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl);

    void updateMainPhotoUrl(int id, String mainPhotoUrl);

    List<RestaurantSearchDetails> searchRestaurants(double longitude, double latitude, String searchText);

}
