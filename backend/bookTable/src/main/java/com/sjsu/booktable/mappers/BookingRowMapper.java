package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.Booking;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BookingRowMapper implements RowMapper<Booking> {

    @Override
    public Booking mapRow(ResultSet rs, int rowNum) throws SQLException {
        return Booking.builder()
                .id(rs.getInt("id"))
                .restaurantId(rs.getInt("restaurant_id"))
                .restaurantName(rs.getString("restaurant_name"))
                .customerId(rs.getString("customer_id"))
                .bookingDate(rs.getDate("booking_date"))
                .bookingTime(rs.getTime("booking_time"))
                .email(rs.getString("email"))
                .partySize(rs.getInt("party_size"))
                .status(rs.getString("status"))
                .createdAt(rs.getTimestamp("created_at"))
                .updatedAt(rs.getTimestamp("updated_at"))
                .build();
    }

}
