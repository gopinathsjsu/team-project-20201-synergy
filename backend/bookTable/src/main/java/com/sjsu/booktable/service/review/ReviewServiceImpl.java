package com.sjsu.booktable.service.review;

import com.sjsu.booktable.model.dto.review.ReviewDto;
import com.sjsu.booktable.model.entity.Review;
import com.sjsu.booktable.repository.ReviewRepository;
import com.sjsu.booktable.utils.ListUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public List<ReviewDto> getReviewsByRestaurantId(int restaurantId) {
        List<Review> reviews = ListUtils.nullSafeList(reviewRepository.findByRestaurantId(restaurantId));
        return reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public double getAverageRatingByRestaurant(int restaurantId) {
        return reviewRepository.getAverageRatingByRestaurant(restaurantId);
    }

    private ReviewDto convertToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .restaurantId(review.getRestaurantId())
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .createdAt(review.getCreatedAt())
                .userName(review.getUserName())
                .build();
    }


}