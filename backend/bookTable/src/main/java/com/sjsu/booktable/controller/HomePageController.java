package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.restaurantSearch.NearbyRestaurantRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchRequest;
import com.sjsu.booktable.service.restaurant.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomePageController {

    private final RestaurantService restaurantService;

    @PostMapping("/restaurants/search")
    public ResponseEntity searchRestaurants(@RequestBody @Valid RestaurantSearchRequest restaurantSearchRequest){
        return ResponseEntity.ok(BTResponse.success(restaurantService.searchRestaurants(restaurantSearchRequest)));
    }

    @PostMapping("/restaurants/nearby")
    public ResponseEntity getNearbyRestaurants(@RequestBody @Valid NearbyRestaurantRequest request){
        return ResponseEntity.ok(BTResponse.success(restaurantService.getNearbyRestaurants(request)));
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity getRestaurantById(@PathVariable Integer id){
        return ResponseEntity.ok(BTResponse.success(restaurantService.fetchRestaurantDetails(id)));
    }
}


/*

package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchRequest;
import com.sjsu.booktable.service.restaurant.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping; // Import GetMapping
import org.springframework.web.bind.annotation.PathVariable; // Import PathVariable


@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final RestaurantService restaurantService;

    @PostMapping("/restaurants/search")
    @PreAuthorize("hasAuthority('Customer')")
    public ResponseEntity searchRestaurants(@RequestBody @Valid RestaurantSearchRequest restaurantSearchRequest){
        return ResponseEntity.ok(BTResponse.success(restaurantService.searchRestaurants(restaurantSearchRequest)));
    }

    // --- Start: Added endpoint for customers to fetch restaurant details ---
    @GetMapping("/restaurants/{id}")
    @PreAuthorize("hasAuthority('Customer')") // Ensure only customers can access this
    public ResponseEntity fetchRestaurantDetails(@PathVariable int id) {
        // This calls the same service method used by the ManagerController,
        // which now includes ratings and reviews.
        return ResponseEntity.ok(BTResponse.success(restaurantService.fetchRestaurantDetails(id)));
    }
    // --- End: Added endpoint for customers to fetch restaurant details ---

}


*/