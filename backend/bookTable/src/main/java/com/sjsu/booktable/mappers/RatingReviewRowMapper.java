package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.RatingReview;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RatingReviewRowMapper implements RowMapper<RatingReview> {

    @Override
    public RatingReview mapRow(ResultSet rs, int rowNum) throws SQLException {
        return RatingReview.builder()
                .id(rs.getInt("id"))
                .restaurantId(rs.getInt("restaurant_id"))
                .rating(rs.getInt("rating"))
                .reviewText(rs.getString("review_text"))
                .createdAt(rs.getTimestamp("created_at"))
                .build();
    }
}