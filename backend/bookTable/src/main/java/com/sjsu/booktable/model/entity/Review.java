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
@Table(name = "reviews")
public class Review {

    private int id;
    private int restaurantId;
    private int rating;
    private String reviewText;
    private String userName;
    private Timestamp createdAt;
}
