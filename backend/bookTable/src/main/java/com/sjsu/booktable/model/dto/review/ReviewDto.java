package com.sjsu.booktable.model.dto.review;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class ReviewDto {
    private int id;
    private int restaurantId;
    // private String userName; // Or user details if you add userId to Review entity
    private int rating;
    private String reviewText;
    private Timestamp createdAt;
}