package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.RestaurantRowMapper;
import com.sjsu.booktable.mappers.RestaurantSearchRowMapper;
import com.sjsu.booktable.model.dto.restaurant.RestaurantDetailsRequest;
import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import com.sjsu.booktable.model.entity.Restaurant;
import com.sjsu.booktable.utils.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.time.LocalDateTime;


@Repository
public class RestaurantRepositoryImpl implements RestaurantRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final int FIXED_RADIUS = 15000; // 15 km in meters for ST_Distance_Sphere

    @Override
    public Restaurant findById(int id) {
        String sql = "SELECT id, name, cuisine_type, cost_rating, description, contact_phone, " +
                "address_line, city, state, zip_code, country, " +
                "ST_X(location) as longitude, ST_Y(location) as latitude, " +
                "main_photo_url, created_at, updated_at, approved, manager_id, deleted " +
                "FROM restaurants WHERE id = ?";
        try {
            return this.jdbcTemplate.queryForObject(sql, new RestaurantRowMapper(), id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null; // Return null if not found
        }
    }

    @Override
    public List<Restaurant> findByApproved(boolean approved) {
        String sql = "SELECT * FROM restaurants WHERE approved = ? AND deleted = false";
        return this.jdbcTemplate.query(sql, new RestaurantRowMapper(), approved);
    }

    @Override
    public void updateRestaurant(Restaurant restaurant) {
        // This only updates the approved status based on the AdminService logic
        String sql = "UPDATE restaurants SET approved = ?, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, restaurant.isApproved(), restaurant.getId());
    }

    @Override
    public void deleteById(int id) {
        // This performs a soft delete
        String sql = "UPDATE restaurants SET deleted = TRUE, updated_at = NOW() WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public List<Restaurant> getMostPopularRestaurants(LocalDateTime startDate, LocalDateTime endDate) {

        String sql = """
            SELECT r.* FROM restaurants r
            JOIN bookings b ON r.id = b.restaurant_id
            WHERE b.booking_date BETWEEN DATE(?) AND DATE(?) -- Corrected filtering
            AND r.deleted = false
            GROUP BY r.id
            ORDER BY COUNT(b.id) DESC
            LIMIT 10
            """;
        return jdbcTemplate.query(sql, new RestaurantRowMapper(), startDate, endDate);
    }

    @Override
    public int getTotalReservations(LocalDateTime startDate, LocalDateTime endDate) {

        String sql = "SELECT COUNT(*) FROM bookings WHERE booking_date BETWEEN DATE(?) AND DATE(?)";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, startDate, endDate);
        return count != null ? count : 0; // Handle potential null result from queryForObject
    }

    @Override
    public int addRestaurantDetails(RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl, String managerId) {
        String sql = "INSERT INTO restaurants (name, cuisine_type, cost_rating, description, contact_phone, address_line, city, state, zip_code, country, location, main_photo_url, approved, manager_id, deleted, created_at, updated_at)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, POINT(?, ?), ?, ?, ?, false, NOW(), NOW())";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, details.getName());
            ps.setString(2, details.getCuisineType());
            ps.setInt(3, details.getCostRating());
            ps.setString(4, details.getDescription());
            ps.setString(5, details.getContactPhone());
            ps.setString(6, details.getAddressLine());
            ps.setString(7, details.getCity());
            ps.setString(8, details.getState());
            ps.setString(9, details.getZipCode());
            ps.setString(10, details.getCountry());
            ps.setDouble(11, longitude); // Longitude first for POINT()
            ps.setDouble(12, latitude);  // Latitude second for POINT()
            ps.setString(13, photoUrl);
            ps.setBoolean(14, false); // Default to not approved
            ps.setString(15, managerId);

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
    public void updateRestaurantDetails(int id, RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl) {
        String sql = "UPDATE restaurants SET name = ?, cuisine_type = ?, cost_rating = ?, description = ?, contact_phone = ?, " +
                "address_line = ?, city = ?, state = ?, zip_code = ?, country = ?, location = POINT(?, ?), main_photo_url = ?, updated_at = NOW() " +
                "WHERE id = ?";
        jdbcTemplate.update(sql,
                details.getName(), details.getCuisineType(), details.getCostRating(), details.getDescription(),
                details.getContactPhone(), details.getAddressLine(), details.getCity(), details.getState(),
                details.getZipCode(), details.getCountry(), longitude, latitude, photoUrl, id);
    }

    @Override
    public List<RestaurantSearchDetails> searchRestaurants(double longitude, double latitude, String searchText) {
        // Note: Using ST_Distance_Sphere which takes (point1, point2) where points are (longitude, latitude)
        // The POINT() function in MySQL also stores as (longitude, latitude)
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT id, name, cuisine_type, cost_rating, address_line, city, state, zip_code, main_photo_url, ");
        // Calculate distance in meters using user's location and restaurant's location
        sql.append("ST_Distance_Sphere(location, POINT(?, ?)) AS distance "); // Parameters: restaurant's location, user's location (lng, lat)
        sql.append("FROM restaurants ");
        sql.append("WHERE approved = TRUE AND deleted = FALSE ");
        // Filter by distance using the same function and radius
        sql.append("AND ST_Distance_Sphere(location, POINT(?, ?)) <= ? "); // Parameters: restaurant's location, user's location (lng, lat), radius in meters

        Object[] params;
        // Parameters need to be in the order they appear in the SQL: userLng, userLat, userLng, userLat, radius
        List<Object> paramList = new java.util.ArrayList<>(List.of(longitude, latitude, longitude, latitude, FIXED_RADIUS));

        if (!StringUtils.isBlank(searchText)) {
            sql.append("AND (name LIKE ? OR description LIKE ? OR cuisine_type LIKE ?) ");
            String likeParam = "%" + searchText.trim() + "%";
            paramList.add(likeParam);
            paramList.add(likeParam);
            paramList.add(likeParam);
        }

        sql.append("ORDER BY distance ASC");

        params = paramList.toArray(); // Convert list to array for query method

        return jdbcTemplate.query(sql.toString(), new RestaurantSearchRowMapper(), params);
    }


    @Override
    public List<RestaurantSearchDetails> findByManagerId(String managerId) {
        // Include approved status in the selection for the manager view
        String sql = "SELECT id, name, cuisine_type, cost_rating, address_line, city, state, zip_code, main_photo_url, approved FROM restaurants WHERE manager_id = ? AND deleted = FALSE";
        return this.jdbcTemplate.query(sql, new RestaurantSearchRowMapper(), managerId);
    }

    @Override
    public List<Restaurant> findAllNonDeleted() {
        String sql = "SELECT * FROM restaurants WHERE deleted = false";
        return this.jdbcTemplate.query(sql, new RestaurantRowMapper());
    }

    @Override
    public List<RestaurantSearchDetails> findNearbyRestaurants(double longitude, double latitude, int radiusInKm) {
        int radiusInMeters = radiusInKm * 1000;

        String sql = "SELECT id, name, cuisine_type, cost_rating, address_line, city, state, zip_code, main_photo_url, " +
                "ST_Distance_Sphere(location, POINT(?, ?)) AS distance " +
                "FROM restaurants " +
                "WHERE approved = TRUE AND deleted = FALSE " +
                "AND ST_Distance_Sphere(location, POINT(?, ?)) <= ? " +
                "ORDER BY distance ";

        Object[] params = {longitude, latitude, longitude, latitude, radiusInMeters};
        return jdbcTemplate.query(sql, new RestaurantSearchRowMapper(), params);
    }
}