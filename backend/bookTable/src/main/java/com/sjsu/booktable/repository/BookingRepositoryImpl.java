package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.BookingRowMapper;
import com.sjsu.booktable.model.dto.booking.BookingRequestDTO;
import com.sjsu.booktable.model.entity.Booking;
import com.sjsu.booktable.model.enums.BookingStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.sjsu.booktable.utils.SQLUtils.buildPlaceholders;

@Repository
public class BookingRepositoryImpl implements BookingRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int saveBooking(BookingRequestDTO bookingRequest) {
        int restaurantId = bookingRequest.getRestaurantId();
        String restaurantName = bookingRequest.getRestaurantName();
        String customerId = bookingRequest.getCustomerId();
        Date bookingDate = Date.valueOf(bookingRequest.getBookingDate());
        Time bookingTime = Time.valueOf(bookingRequest.getBookingTime());
        int partySize = bookingRequest.getPartySize();
        String email = bookingRequest.getEmail();
        String status = BookingStatus.CONFIRMED.getStatus();
        String insertBookingSql =  "INSERT INTO bookings (restaurant_id, restaurant_name, customer_id, booking_date, booking_time, email, party_size, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        this.jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(insertBookingSql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, restaurantId);
            ps.setString(2, restaurantName);
            ps.setString(3, customerId);
            ps.setDate(4, bookingDate);
            ps.setTime(5, bookingTime);
            ps.setString(6, email);
            ps.setInt(7, partySize);
            ps.setString(8, status);
            return ps;
        }, keyHolder);

        // Handle potential null key
        Number key = keyHolder.getKey();
        if (key == null) {
            throw new RuntimeException("Failed to retrieve generated key after restaurant insert.");
        }
        return key.intValue();
    }

    @Override
    public int cancelBookingById(int bookingId) {
        String sqlSoftDeleteQuery = "UPDATE bookings SET status = ? WHERE id = ?";
        return jdbcTemplate.update(sqlSoftDeleteQuery, BookingStatus.CANCELLED.getStatus(), bookingId);
    }

    @Override
    public Booking findBookingById(int bookingId) {
        String sql = "SELECT * FROM bookings WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BookingRowMapper(), bookingId);
        } catch (EmptyResultDataAccessException e) {
            return null; // not found
        }
    }

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
            int total = ((Number) row.get("total")).intValue();
            timeSlotBookedCount.put(bookingTime.toLocalTime(), total);
        }
        return timeSlotBookedCount;
    }

    @Override
    public List<Booking> findBookingsByCustomerId(String customerId) {
        String sql = "SELECT * FROM bookings WHERE customer_id = ? ORDER BY booking_date DESC, booking_time DESC";
        return jdbcTemplate.query(sql, new BookingRowMapper(), customerId);
    }

    @Override
    public Booking findBookingWithConflict(String customerId, LocalDate reservationDate, LocalTime fromTime, LocalTime toTime) {
        String sql = "SELECT * FROM bookings WHERE customer_id = ? AND booking_date = ? AND booking_time BETWEEN ? AND ? AND status != ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BookingRowMapper(), 
                customerId, 
                Date.valueOf(reservationDate), 
                Time.valueOf(fromTime), 
                Time.valueOf(toTime),
                BookingStatus.CANCELLED.getStatus());
        } catch (Exception e) {
            return null; // No conflicts found
        }
    }

    
    @Override
    public Map<Integer, Integer> getBookingCountsByRestaurantIds(List<Integer> restaurantIds, LocalDate date) {
        if (restaurantIds == null || restaurantIds.isEmpty()) {
            return Collections.emptyMap();
        }
        
        // Create the SQL query to count bookings grouped by restaurant
        String sql = "SELECT restaurant_id, COUNT(*) as booking_count " +
                     "FROM bookings " +
                     "WHERE restaurant_id IN (" + buildPlaceholders(restaurantIds) + ") " +
                     "AND booking_date = ? " +
                     "AND status = 'confirmed' " + 
                     "GROUP BY restaurant_id";
        
        // Build the parameters array (restaurant IDs followed by the date)
        Object[] params = new Object[restaurantIds.size() + 1];
        for (int i = 0; i < restaurantIds.size(); i++) {
            params[i] = restaurantIds.get(i);
        }
        params[restaurantIds.size()] = date;
        
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, params);
        
        // Build the result map
        Map<Integer, Integer> bookingCounts = new HashMap<>();
        
        // Initialize all IDs with 0 bookings
        for (Integer restaurantId : restaurantIds) {
            bookingCounts.put(restaurantId, 0);
        }
        
        // Update counts from database results
        for (Map<String, Object> row : rows) {
            Integer restaurantId = (Integer) row.get("restaurant_id");
            Integer count = ((Number) row.get("booking_count")).intValue();
            bookingCounts.put(restaurantId, count);
        }
        
        return bookingCounts;
    }
}
