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
