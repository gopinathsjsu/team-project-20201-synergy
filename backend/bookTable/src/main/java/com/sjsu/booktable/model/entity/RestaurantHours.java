package com.sjsu.booktable.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

import java.sql.Time;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "hours")
public class RestaurantHours {
    private int id;
    private int restaurantId;
    private int dayOfWeek;    // 0 = Sunday, 6 = Saturday
    private Time openTime;  // Format: "HH:mm:ss" (e.g., "11:00:00")
    private Time closeTime; // Format: "HH:mm:ss" (e.g., "22:00:00")
}
