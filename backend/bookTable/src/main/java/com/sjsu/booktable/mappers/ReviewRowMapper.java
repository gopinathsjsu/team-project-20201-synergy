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
                .restaurantId(rs.getInt("restaurantId"))
                .rating(rs.getInt("rating"))
                .reviewText(rs.getString("reviewText"))
                .createdAt(rs.getTimestamp("createdAt"))
                .userName(rs.getString("userName"))
                .build();
    }
}