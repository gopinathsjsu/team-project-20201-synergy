package com.sjsu.booktable.controller;

/*RestaurantResponse - Data Transfer Object for restaurant data
Restaurant - Entity class representing a restaurant in the database
AdminService - Interface defining admin operations*/
import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


/* @RestController - This annotation tells Spring that this class will handle HTTP requests and return responses
@RequestMapping("/api/admin") - All endpoints in this controller will start with /api/admin
@PreAuthorize("hasRole('ADMIN')") - Only users with ADMIN role can access these endpoints
public class AdminController - Class declaration*/
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('Admin')")
public class AdminController {

    /* Spring's dependency injection annotation. It automatically provides an instance of AdminService */
    @Autowired
    private AdminService adminService;
/*@GetMapping - Maps HTTP GET requests to this method
"/restaurants/pending" - The endpoint path (full path will be /api/admin/restaurants/pending)
ResponseEntity<List<RestaurantDto>> - Return type that includes HTTP status and body
adminService.getPendingRestaurants() - Calls service method to get pending restaurants
ResponseEntity.ok() - Wraps the result in a 200 OK response */
    @GetMapping("/restaurants/pending")
    public ResponseEntity<List<RestaurantResponse>> getPendingRestaurants() {
        return ResponseEntity.ok(adminService.getPendingRestaurants());
    }
    
/*You use @PathVariable to bind it to a method parameter */
    @PostMapping("/restaurants/{restaurantId}/approve")
    public ResponseEntity<RestaurantResponse> approveRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(adminService.approveRestaurant(restaurantId));
    }

    /*Let's break down ResponseEntity.ok().build():
ResponseEntity.ok() - Creates a builder with status code 200 (OK)
.build() - Finalizes the response with no body
This is commonly used for operations that don't need to return any data, like:
DELETE operations (when you just want to confirm deletion)
POST operations that don't need to return data
PUT operations that just confirm success */
    @DeleteMapping("/restaurants/{restaurantId}")
    public ResponseEntity<Void> removeRestaurant(@PathVariable String restaurantId) {
        adminService.removeRestaurant(restaurantId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/analytics/reservations")
    public ResponseEntity<Map<String, Object>> getReservationAnalytics() {
        return ResponseEntity.ok(adminService.getReservationAnalytics());
    }
} 