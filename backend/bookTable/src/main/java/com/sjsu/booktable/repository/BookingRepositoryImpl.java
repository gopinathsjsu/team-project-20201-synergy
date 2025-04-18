package com.sjsu.booktable.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.sjsu.booktable.utils.SQLUtils.buildPlaceholders;

@Repository
public class BookingRepositoryImpl implements BookingRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Map<LocalTime, Integer> getBookedCapacityForTimeSlotsForRestaurant(int restaurantId, LocalDate reservationDate, List<LocalTime> timeSlots) {
        String sql = "SELECT booking_time, SUM(party_size) AS total FROM bookings WHERE restaurant_id = ? AND booking_date = ? AND status = 'confirmed' " +
                "AND booking_time IN (" + buildPlaceholders(timeSlots) + ") GROUP BY booking_time";

        // Build parameter array: first restaurantId and reservationDate, then each candidate slot as java.sql.Time.
        Object[] params = new Object[2 + timeSlots.size()];
        params[0] = restaurantId;
        params[1] = reservationDate;
        int index = 2;
        for (LocalTime slot : timeSlots) {
            params[index++] = Time.valueOf(slot);
        }

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);

        Map<LocalTime, Integer> timeSlotBookedCount = new HashMap<>();
        // Initialize map with candidate slots, defaulting to 0 booked capacity.
        for (LocalTime slot : timeSlots) {
            timeSlotBookedCount.put(slot, 0);
        }

        // Process the query results and update the map.
        for (Map<String, Object> row : rows) {
            Time bookingTime = (Time) row.get("booking_time");
            int total = (Integer) row.get("total");
            timeSlotBookedCount.put(bookingTime.toLocalTime(), total);
        }
        return timeSlotBookedCount;
    }

}
