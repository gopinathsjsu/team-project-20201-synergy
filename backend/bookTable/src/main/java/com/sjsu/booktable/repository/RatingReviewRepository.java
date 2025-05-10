package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.entity.RatingReview;
import java.util.List;

public interface RatingReviewRepository {

    List<RatingReview> findByRestaurantId(int restaurantId);

    Double findAverageRatingByRestaurantId(int restaurantId);
}