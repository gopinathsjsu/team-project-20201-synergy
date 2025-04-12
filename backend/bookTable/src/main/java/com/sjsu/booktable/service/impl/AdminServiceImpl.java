package com.sjsu.booktable.service.impl;

import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.model.entity.Restaurant;
import com.sjsu.booktable.repository.RestaurantRepository;
import com.sjsu.booktable.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/*@Service - Spring annotation marking this as a service class
 */

@Service
public class AdminServiceImpl implements AdminService {

    /*Injects the RestaurantRepository dependency
    This is how we access the database
 */
    @Autowired
    private RestaurantRepository restaurantRepository;

    
    @Override
    public List<RestaurantResponse> getPendingRestaurants() {
        return restaurantRepository.findByApproved(false)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RestaurantResponse approveRestaurant(String restaurantId) {
        int id = Integer.parseInt(restaurantId);
        Restaurant restaurant = restaurantRepository.findById(id);
        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found");
        }
        restaurant.setApproved(true);
        restaurantRepository.updateRestaurant(restaurant);
        return convertToResponse(restaurant);
    }

    @Override
    public void removeRestaurant(String restaurantId) {
        int id = Integer.parseInt(restaurantId);
        restaurantRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> getReservationAnalytics() {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minus(1, ChronoUnit.MONTHS);
        
        int totalReservations = restaurantRepository.getTotalReservations(startDate, endDate);
        double averageReservationsPerDay = totalReservations / 30.0; // Assuming 30 days in month
        
        List<Restaurant> popularRestaurants = restaurantRepository.getMostPopularRestaurants(startDate, endDate);
        List<RestaurantResponse> popularRestaurantResponses = popularRestaurants.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return Map.of(
            "totalReservations", totalReservations,
            "averageReservationsPerDay", averageReservationsPerDay,
            "mostPopularRestaurants", popularRestaurantResponses
        );
    }
    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .approved(restaurant.isApproved())
                .build();
    }
} 