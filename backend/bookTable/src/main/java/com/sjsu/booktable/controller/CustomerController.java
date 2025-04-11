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

}
