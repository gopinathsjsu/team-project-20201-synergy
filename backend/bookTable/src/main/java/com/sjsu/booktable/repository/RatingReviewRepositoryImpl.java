package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.RatingReviewRowMapper;
import com.sjsu.booktable.model.entity.RatingReview;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RatingReviewRepositoryImpl implements RatingReviewRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public RatingReviewRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<RatingReview> findByRestaurantId(int restaurantId) {
        String sql = "SELECT id, restaurant_id, rating, review_text, created_at FROM ratings_reviews WHERE restaurant_id = ?";
        return jdbcTemplate.query(sql, new RatingReviewRowMapper(), restaurantId);
    }

     @Override
     public Double findAverageRatingByRestaurantId(int restaurantId) {
         String sql = "SELECT AVG(rating) FROM ratings_reviews WHERE restaurant_id = ?";
         return jdbcTemplate.queryForObject(sql, Double.class, restaurantId);
     }
}