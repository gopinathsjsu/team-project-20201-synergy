package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.RatingReviewRowMapper;
import com.sjsu.booktable.model.entity.RatingReview;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

// Import necessary exception classes
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;


@Repository
@Slf4j
public class RatingReviewRepositoryImpl implements RatingReviewRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public RatingReviewRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<RatingReview> findByRestaurantId(int restaurantId) {
        String sql = "SELECT * FROM ratings_reviews WHERE restaurant_id = ?";
        try {
            // Attempt to execute the query
            return jdbcTemplate.query(sql, new RatingReviewRowMapper(), restaurantId);
        } catch (Exception e) {
            log.info("exception :: ", e);
            // Catch and re-throw any other unexpected errors
            throw e;
        }
    }

    @Override
    public Double findAverageRatingByRestaurantId(int restaurantId) {
        String sql = "SELECT AVG(rating) FROM ratings_reviews WHERE restaurant_id = ?";
        try {
            // queryForObject for AVG might return null if there are no ratings,
            // which is handled by returning null for Double.class.
            // EmptyResultDataAccessException is thrown if the query returns no rows,
            // which shouldn't happen with AVG() on an existing table but we catch it for safety.
            return jdbcTemplate.queryForObject(sql, Double.class, restaurantId);
        } catch (EmptyResultDataAccessException e) {
            // If no rows are returned (shouldn't happen with AVG but good practice),
            // you might want to return 0.0 for the average rating.
            return 0.0;
        } catch (BadSqlGrammarException e) {
            // Catch and re-throw the specific SQL grammar error
            throw e;
        } catch (DataAccessException e) {
            // Catch and re-throw other data access related errors
            throw e;
        } catch (Exception e) {
            // Catch and re-throw any other unexpected errors
            throw e;
        }
    }
}