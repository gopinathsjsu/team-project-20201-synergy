package com.sjsu.booktable.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bookings")
public class Booking {

    private int id;
    private int restaurantId;
    private String restaurantName;
    private String customerId;
    private Date bookingDate;
    private Time bookingTime;
    private int partySize;
    private String status;
    private String email;
    private Timestamp createdAt;
    private Timestamp updatedAt;

}
