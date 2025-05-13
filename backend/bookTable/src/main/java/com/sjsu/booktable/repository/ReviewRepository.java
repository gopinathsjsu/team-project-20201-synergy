package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.entity.Review;
import java.util.List;

public interface ReviewRepository {
    List<Review> findByRestaurantId(int restaurantId);

    double getAverageRatingByRestaurant(int restaurantId);
}


