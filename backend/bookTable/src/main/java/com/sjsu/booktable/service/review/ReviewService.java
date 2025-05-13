package com.sjsu.booktable.service.review;

import com.sjsu.booktable.model.dto.review.ReviewDto;
import java.util.List;

public interface ReviewService {
    List<ReviewDto> getReviewsByRestaurantId(int restaurantId);

    double getAverageRatingByRestaurant(int restaurantId);
}