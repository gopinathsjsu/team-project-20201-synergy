package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.Review;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ReviewRowMapper implements RowMapper<Review> {

    @Override
    public Review mapRow(ResultSet rs, int rowNum) throws SQLException {
        return Review.builder()
                .id(rs.getInt("id"))
                .restaurantId(rs.getInt("restaurant_id"))
                .rating(rs.getInt("rating"))
                .reviewText(rs.getString("review_text"))
                .createdAt(rs.getTimestamp("created_at"))
                .userName(rs.getString("user_name"))
                .build();
    }
}