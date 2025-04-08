package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.restaurant.RestaurantRequest;
import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.service.restaurant.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class RestaurantManagerController {

    private final RestaurantService restaurantService;

    @PostMapping("/restaurants")
    @PreAuthorize("hasAuthority('RestaurantManager')")
    public ResponseEntity addRestaurant(@Valid @RequestPart("data") RestaurantRequest request,
                                        @AuthenticationPrincipal Jwt jwt) {
        // Extract manager ID from JWT 'sub' claim (Cognito user ID)
        String managerIdStr = jwt.getSubject();
        // TODO: Handle fetching manager id based on cognito_sub
        int managerId = Integer.parseInt(managerIdStr);
        RestaurantResponse response = restaurantService.addRestaurant(request, managerId);
        return ResponseEntity.ok(BTResponse.success(response));
    }

    @PutMapping("/restaurants/{id}")
    @PreAuthorize("hasAuthority('RestaurantManager')")
    public ResponseEntity updateRestaurant(@PathVariable int id,
                                           @RequestPart("data") RestaurantRequest request,
                                           @AuthenticationPrincipal Jwt jwt) {

        // Extract manager ID from JWT 'sub' claim (Cognito user ID)
        String managerIdStr = jwt.getSubject();
        // TODO: Handle fetching manager id based on cognito_sub
        int managerId = Integer.parseInt(managerIdStr);
        RestaurantResponse response = restaurantService.updateRestaurant(id, request, managerId);
        return ResponseEntity.ok(BTResponse.success(response));
    }


}
