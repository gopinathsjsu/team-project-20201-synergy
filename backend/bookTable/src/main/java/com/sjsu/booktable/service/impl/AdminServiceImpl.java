package com.sjsu.booktable.service.impl;

import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.model.entity.Restaurant;
import com.sjsu.booktable.repository.RestaurantRepository;
import com.sjsu.booktable.service.AdminService;
<<<<<<< HEAD
import lombok.extern.slf4j.Slf4j;
=======
>>>>>>> 2768e3a2c3df43ce0bd132a2afb78d04a824772d
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
<<<<<<< HEAD
@Slf4j
=======
>>>>>>> 2768e3a2c3df43ce0bd132a2afb78d04a824772d
public class AdminServiceImpl implements AdminService {

    /*Injects the RestaurantRepository dependency
    This is how we access the database
 */
    @Autowired
    private RestaurantRepository restaurantRepository;

    
    @Override
    public List<RestaurantResponse> getPendingRestaurants() {
<<<<<<< HEAD
        try {
            return restaurantRepository.findByApproved(false)
                    .stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Exception while fetching pending restaurants, ", e);
            throw new RuntimeException("Failed to fetch pending restaurants: " + e.getMessage());
        }
=======
        return restaurantRepository.findByApproved(false)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
>>>>>>> 2768e3a2c3df43ce0bd132a2afb78d04a824772d
    }

    @Override
    public RestaurantResponse approveRestaurant(String restaurantId) {
<<<<<<< HEAD
        try {
            int id = Integer.parseInt(restaurantId);
            Restaurant restaurant = restaurantRepository.findById(id);
            if (restaurant == null) {
                throw new RuntimeException("Restaurant not found");
            }
            restaurant.setApproved(true);
            restaurantRepository.updateRestaurant(restaurant);
            return convertToResponse(restaurant);
        } catch (NumberFormatException e) {
            log.error("Invalid restaurant ID format: {}", restaurantId, e);
            throw new RuntimeException("Invalid restaurant ID format");
        } catch (Exception e) {
            log.error("Exception while approving restaurant {}, ", restaurantId, e);
            throw new RuntimeException("Failed to approve restaurant: " + e.getMessage());
        }
=======
        int id = Integer.parseInt(restaurantId);
        Restaurant restaurant = restaurantRepository.findById(id);
        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found");
        }
        restaurant.setApproved(true);
        restaurantRepository.updateRestaurant(restaurant);
        return convertToResponse(restaurant);
>>>>>>> 2768e3a2c3df43ce0bd132a2afb78d04a824772d
    }

    @Override
    public void removeRestaurant(String restaurantId) {
<<<<<<< HEAD
        try {
            int id = Integer.parseInt(restaurantId);
            restaurantRepository.deleteById(id);
        } catch (NumberFormatException e) {
            log.error("Invalid restaurant ID format: {}", restaurantId, e);
            throw new RuntimeException("Invalid restaurant ID format");
        } catch (Exception e) {
            log.error("Exception while removing restaurant {}, ", restaurantId, e);
            throw new RuntimeException("Failed to remove restaurant: " + e.getMessage());
        }
    }
    
    @Override
    public Map<String, Object> getReservationAnalytics() {
        try {
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
        } catch (Exception e) {
            log.error("Exception while fetching reservation analytics, ", e);
            throw new RuntimeException("Failed to fetch reservation analytics: " + e.getMessage());
        }
=======
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
>>>>>>> 2768e3a2c3df43ce0bd132a2afb78d04a824772d
    }
    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .approved(restaurant.isApproved())
                .build();
    }
} 