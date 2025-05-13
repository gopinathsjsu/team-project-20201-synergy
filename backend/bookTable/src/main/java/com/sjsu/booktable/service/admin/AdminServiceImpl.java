package com.sjsu.booktable.service.admin;

import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.model.entity.Restaurant;
import com.sjsu.booktable.repository.RestaurantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminServiceImpl implements AdminService {


    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public List<RestaurantResponse> getPendingRestaurants() {
        try {
            return restaurantRepository.findByApproved(false)
                    .stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Exception while fetching pending restaurants, ", e);
            throw new RuntimeException("Failed to fetch pending restaurants: " + e.getMessage());
        }
    }

    @Override
    public RestaurantResponse approveRestaurant(String restaurantId) {
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
    }

    @Override
    public void removeRestaurant(String restaurantId) {
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
            YearMonth currentYearMonth = YearMonth.now();
            // Start of the current month
            LocalDateTime startDate = currentYearMonth.atDay(1).atStartOfDay();
            // End of the current month
            LocalDateTime endDate = currentYearMonth.atEndOfMonth().atTime(23, 59, 59, 999999999); // End of the last day of the month

            int totalReservations = restaurantRepository.getTotalReservations(startDate, endDate);

            // Number of days in the current month
            int daysInMonth = currentYearMonth.lengthOfMonth();

            double averageReservationsPerDay = totalReservations > 0 ? (double) totalReservations / daysInMonth : 0.0;

            List<Restaurant> popularRestaurants = restaurantRepository.getMostPopularRestaurants(startDate, endDate);
            List<RestaurantResponse> popularRestaurantResponses = popularRestaurants.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());

            return Map.of(
                    "totalReservations", totalReservations,
                    "averageReservationsPerDay", averageReservationsPerDay,
                    "mostPopularRestaurants", popularRestaurantResponses,
                    "startDate", startDate,
                    "endDate", endDate
            );
        } catch (Exception e) {
            log.error("Exception while fetching reservation analytics, ", e);
            throw new RuntimeException("Failed to fetch reservation analytics: " + e.getMessage());
        }
    }

    @Override
    public List<RestaurantResponse> getAllRestaurants() {
        try {
            return restaurantRepository.findAllNonDeleted()
                    .stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Exception while fetching all restaurants, ", e);
            throw new RuntimeException("Failed to fetch all restaurants: " + e.getMessage());
        }
    }

    private RestaurantResponse convertToResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .cuisineType(restaurant.getCuisineType())
                .costRating(restaurant.getCostRating())
                .description(restaurant.getDescription())
                .contactPhone(restaurant.getContactPhone())
                .addressLine(restaurant.getAddressLine())
                .city(restaurant.getCity())
                .state(restaurant.getState())
                .zipCode(restaurant.getZipCode())
                .country(restaurant.getCountry())
                .mainPhotoUrl(restaurant.getMainPhotoUrl())
                .approved(restaurant.isApproved())
                .build();
    }
}
