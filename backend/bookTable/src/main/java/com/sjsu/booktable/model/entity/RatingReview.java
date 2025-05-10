package com.sjsu.booktable.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "ratings_reviews")
public class RatingReview {

    private int id;
    private int restaurantId;
    private int rating; // e.g., 1-5
    private String reviewText;
    private Timestamp createdAt;
}