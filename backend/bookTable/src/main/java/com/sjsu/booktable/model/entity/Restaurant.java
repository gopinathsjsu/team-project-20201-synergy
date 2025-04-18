package com.sjsu.booktable.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.data.relational.core.mapping.Table;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "restaurants")
public class Restaurant {

    private int id;
    private String name;
    private String cuisineType;
    private int costRating;         // Must be between 1 and 4
    private String description;
    private String contactPhone;
    private String addressLine;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private Point location; // MySQL POINT type
    private String mainPhotoUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private boolean approved;
    private String managerId;          // Links to the users (restaurant manager)
    private boolean deleted;
}
