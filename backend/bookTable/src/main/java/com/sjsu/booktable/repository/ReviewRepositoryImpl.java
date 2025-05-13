package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.ReviewRowMapper;
import com.sjsu.booktable.model.entity.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException; // Import this
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Review> findByRestaurantId(int restaurantId) {
        String sql = "SELECT id, restaurant_id, rating, review_text, created_at FROM reviews WHERE restaurant_id = ? ORDER BY created_at DESC";
        try {
            return jdbcTemplate.query(sql, new ReviewRowMapper(), restaurantId);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return List.of();
        }
    }

    @Override
    public double getAverageRatingByRestaurant(int restaurantId) {
        String sql = "SELECT COALESCE(AVG(rating), 0.0) FROM reviews WHERE restaurant_id = ?";
        try {
            Double average = jdbcTemplate.queryForObject(sql, Double.class, restaurantId);
            return average != null ? average : 0.0;
        } catch (EmptyResultDataAccessException e) {
            // This can happen if a restaurant has no reviews yet.
            return 0.0;
        } catch (Exception e) {
            System.err.println("Error fetching average rating for restaurant " + restaurantId + ": " + e.getMessage());
            return 0.0;
        }
    }
}