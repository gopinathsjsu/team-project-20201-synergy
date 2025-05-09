package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.restaurant.RestaurantDetailsResponse;
import com.sjsu.booktable.model.dto.restaurant.RestaurantRequest;
import com.sjsu.booktable.model.dto.restaurant.RestaurantResponse;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchResponse;
import com.sjsu.booktable.service.restaurant.RestaurantService;
import com.sjsu.booktable.service.s3.S3Service;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@Slf4j
public class RestaurantManagerController {

    private final RestaurantService restaurantService;
    private final S3Service s3Service;

    @GetMapping("/restaurants")
    @PreAuthorize("hasAuthority('RestaurantManager')")
    public ResponseEntity fetchRestaurants(@AuthenticationPrincipal Jwt jwt) {
        // Extract manager ID from JWT 'sub' claim (Cognito user ID)
        String managerId = jwt.getSubject();
        log.info("Manager ID from JWT: {}", managerId);
        RestaurantSearchResponse restaurantDetails = restaurantService.fetchRestaurantsByManager(managerId);
        return ResponseEntity.ok(BTResponse.success(restaurantDetails));
    }

    @PostMapping( "/restaurants")
    @PreAuthorize("hasAuthority('RestaurantManager')")
    public ResponseEntity addRestaurant(@Valid @RequestBody RestaurantRequest request, @AuthenticationPrincipal Jwt jwt) {
        // Extract manager ID from JWT 'sub' claim (Cognito user ID)
        String managerId = jwt.getSubject();
        log.info("Manager ID from JWT: {}", managerId);
        RestaurantResponse response = restaurantService.addRestaurant(request, managerId);
        return ResponseEntity.ok(BTResponse.success(response));
    }

    @GetMapping("/restaurants/{id}")
    @PreAuthorize("hasAuthority('RestaurantManager')")
    public ResponseEntity fetchRestaurantDetails(@PathVariable int id) {
        RestaurantDetailsResponse response = restaurantService.fetchRestaurantDetails(id);
        return ResponseEntity.ok(BTResponse.success(response));
    }

    @PutMapping("/restaurants/{id}")
    @PreAuthorize("hasAuthority('RestaurantManager')")
    public ResponseEntity updateRestaurant(@PathVariable int id, @Valid @RequestBody RestaurantRequest request, @AuthenticationPrincipal Jwt jwt) {
        // Extract manager ID from JWT 'sub' claim (Cognito user ID)
        String managerId = jwt.getSubject();
        log.info("Manager ID from JWT: {}", managerId);
        RestaurantResponse response = restaurantService.updateRestaurant(id, request, managerId);
        return ResponseEntity.ok(BTResponse.success(response));
    }

    /**
     * Generates a pre-signed URL for uploading a file via HTTP PUT.
     * The UI should call this endpoint before uploading a file directly to S3.
     * Query parameters:
     * - folder: The target S3 folder (e.g. "restaurants/main" or "restaurants/additional")
     * - fileName: The unique file name to use in S3
     * - expiration: (optional) URL expiration time in minutes (defaults to 10)
     *
     * @return A JSON object with the pre-signed URL.
     */
    @GetMapping("/presigned-url")
    @PreAuthorize("hasAuthority('RestaurantManager')")
    public ResponseEntity getPresignedUrl(@RequestParam String folder,
                                             @RequestParam String fileName,
                                             @RequestParam(required = false, defaultValue = "10") int expiration) {
        URL url = s3Service.generatePresignedUrl(folder, fileName, expiration);
        return ResponseEntity.ok(BTResponse.success(url));
    }

    /**
     * Bulk deletes multiple files from S3.
     * The request body is expected to be a JSON array of S3 object keys.
     * Example request body:
     * [
     *    "restaurants/main/uniqueName-file1.png",
     *    "restaurants/additional/uniqueName-file2.jpg"
     * ]
     *
     * @param keys A list of S3 object keys to be deleted.
     * @return A JSON object with a success message.
     */
    @DeleteMapping("/bulk")
    @PreAuthorize("hasAuthority('RestaurantManager')")
    public ResponseEntity<?> bulkDelete(@RequestBody @NotEmpty List<String> keys) {
        s3Service.deleteFilesBulk(keys);
        return ResponseEntity.ok(BTResponse.success("Files deleted successfully"));
    }


}
