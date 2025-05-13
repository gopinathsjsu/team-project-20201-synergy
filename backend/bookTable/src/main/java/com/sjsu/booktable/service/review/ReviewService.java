package com.sjsu.booktable.service.review;

import com.sjsu.booktable.model.dto.review.ReviewDto; // Or use Review entity
import java.util.List;

public interface ReviewService {
    List<ReviewDto> getReviewsByRestaurantId(int restaurantId); // Or List<Review>
}