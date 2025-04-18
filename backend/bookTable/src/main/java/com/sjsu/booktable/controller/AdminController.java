package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('Admin')") // or @PreAuthorize("hasRole('ADMIN')") based on your project
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/restaurants/pending")
    public ResponseEntity getPendingRestaurants() {
        return ResponseEntity.ok(BTResponse.success(adminService.getPendingRestaurants()));
    }

    @PostMapping("/restaurants/{restaurantId}/approve")
    public ResponseEntity approveRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(BTResponse.success(adminService.approveRestaurant(restaurantId)));
    }

    @DeleteMapping("/restaurants/{restaurantId}")
    public ResponseEntity removeRestaurant(@PathVariable String restaurantId) {
        adminService.removeRestaurant(restaurantId);
        return ResponseEntity.ok(BTResponse.success(null));
    }

    @GetMapping("/analytics/reservations")
    public ResponseEntity getReservationAnalytics() {
        return ResponseEntity.ok(BTResponse.success(adminService.getReservationAnalytics()));
    }
}
