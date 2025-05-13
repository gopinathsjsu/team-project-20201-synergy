package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.ReviewRowMapper;
import com.sjsu.booktable.model.entity.Review;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Slf4j
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Review> findByRestaurantId(int restaurantId) {
        String sql = "SELECT * FROM reviews WHERE restaurantId = ? ORDER BY createdAt DESC";
        return jdbcTemplate.query(sql, new ReviewRowMapper(), restaurantId);
    }

    @Override
    public double getAverageRatingByRestaurant(int restaurantId) {
        String sql = "SELECT COALESCE(AVG(rating), 0.0) FROM reviews WHERE restaurantId = ?";
        try {
            Double average = jdbcTemplate.queryForObject(sql, Double.class, restaurantId);
            return average != null ? average : 0.0;
        } catch (Exception e) {
            log.error("Error fetching average rating for restaurant {}: {}", restaurantId, e.getMessage(), e);
            return 0.0;
        }
    }
}