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

    private static final int FIXED_RADIUS = 15000; // 15 km

    @Override
    public Restaurant findById(int id) {
        String sql = "SELECT * FROM restaurants WHERE id = ? AND deleted = FALSE";
        return this.jdbcTemplate.queryForObject(sql, new RestaurantRowMapper(), id);
    }

    @Override
    public List<Restaurant> findByApproved(boolean approved) {
        String sql = "SELECT * FROM restaurants WHERE approved = ? AND deleted = false";
        return this.jdbcTemplate.query(sql, new RestaurantRowMapper(), approved);
    }

    @Override
    public void updateRestaurant(Restaurant restaurant) {
        String sql = "UPDATE restaurants SET approved = ? WHERE id = ?";
        jdbcTemplate.update(sql, restaurant.isApproved(), restaurant.getId());
    }

    @Override
    public void deleteById(int id) {
        String sql = "UPDATE restaurants SET deleted = ? WHERE id = ?";
        jdbcTemplate.update(sql, true, id);
    }

    @Override
    public List<Restaurant> getMostPopularRestaurants(LocalDateTime startDate, LocalDateTime endDate) {
        String sql = """
            SELECT r.* FROM restaurants r 
            JOIN bookings b ON r.id = b.restaurant_id 
            WHERE b.booking_time BETWEEN ? AND ?
            AND r.deleted = false
            GROUP BY r.id 
            ORDER BY COUNT(b.id) DESC 
            LIMIT 10
            """;
        return jdbcTemplate.query(sql, new RestaurantRowMapper(), startDate, endDate);
    }

    @Override
    public int getTotalReservations(LocalDateTime startDate, LocalDateTime endDate) {
        String sql = "SELECT COUNT(*) FROM bookings WHERE booking_time BETWEEN ? AND ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, startDate, endDate);
    }

    @Override
    public int addRestaurantDetails(RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl, String managerId) {
        String sql = "INSERT INTO restaurants (name, cuisine_type, cost_rating, description, contact_phone, address_line, city, state, zip_code, country, location, main_photo_url, approved, manager_id)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, POINT(?, ?), ?, ?, ?)";

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
            ps.setDouble(11, longitude);
            ps.setDouble(12, latitude);
            ps.setString(13, photoUrl);
            ps.setBoolean(14, false); // Pending approval
            ps.setString(15, managerId);
            return ps;
        }, keyHolder);

        return keyHolder.getKey().intValue();
    }

    @Override
    public void updateRestaurantDetails(int id, RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl) {
        String sql = "UPDATE restaurants SET name = ?, cuisine_type = ?, cost_rating = ?, description = ?, contact_phone = ?, " +
                "address_line = ?, city = ?, state = ?, zip_code = ?, country = ?, location = POINT(?, ?), main_photo_url = ? " +
                "WHERE id = ?";
        jdbcTemplate.update(sql,
                details.getName(), details.getCuisineType(), details.getCostRating(), details.getDescription(),
                details.getContactPhone(), details.getAddressLine(), details.getCity(), details.getState(),
                details.getZipCode(), details.getCountry(), longitude, latitude, photoUrl, id);
    }

    @Override
    public List<RestaurantSearchDetails> searchRestaurants(double longitude, double latitude, String searchText) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT id, name, cuisine_type, cost_rating, address_line, city, state, zip_code, main_photo_url, ");
        sql.append("ST_Distance_Sphere(location, POINT(?, ?)) AS distance ");
        sql.append("FROM restaurants ");
        sql.append("WHERE approved = TRUE AND deleted = FALSE ");
        sql.append("AND ST_Distance_Sphere(location, POINT(?, ?)) <= ? ");

        Object[] params;

        if (!StringUtils.isBlank(searchText)) {
            sql.append("AND (name LIKE ? OR description LIKE ? OR cuisine_type LIKE ?) ");
            String likeParam = "%" + searchText.trim() + "%";
            params = new Object[]{longitude, latitude, longitude, latitude, FIXED_RADIUS, likeParam, likeParam, likeParam};
        } else {
            params = new Object[]{longitude, latitude, longitude, latitude, FIXED_RADIUS};
        }

        sql.append("ORDER BY distance ASC");
        return jdbcTemplate.query(sql.toString(), new RestaurantSearchRowMapper(), params);
    }

    @Override
    public List<RestaurantSearchDetails> findByManagerId(String managerId) {
        String sql = "SELECT id, name, cuisine_type, cost_rating, address_line, city, state, zip_code, main_photo_url, approved FROM restaurants WHERE manager_id = ? AND deleted = FALSE";
        return this.jdbcTemplate.query(sql, new RestaurantSearchRowMapper(), managerId);
    }

    @Override
    public List<Restaurant> findAllNonDeleted() {
        String sql = "SELECT * FROM restaurants WHERE deleted = false";
        return this.jdbcTemplate.query(sql, new RestaurantRowMapper());
    }
}
