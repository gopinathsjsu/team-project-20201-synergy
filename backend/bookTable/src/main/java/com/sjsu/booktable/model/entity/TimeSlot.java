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
@Table(name = "time_slots")
public class TimeSlot {

    private int id;
    private int restaurantId;
    private int dayOfWeek;    // 0 = Sunday, 6 = Saturday
    private Time slotTime;  // Format: "HH:mm:ss", e.g., "18:15:00"
}
