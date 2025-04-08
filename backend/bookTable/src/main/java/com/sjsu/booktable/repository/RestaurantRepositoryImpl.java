package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.RestaurantRowMapper;
import com.sjsu.booktable.model.dto.restaurant.RestaurantDetailsRequest;
import com.sjsu.booktable.model.entity.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
public class RestaurantRepositoryImpl implements RestaurantRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Restaurant findById(int id) {
        String sql = "SELECT * FROM restaurants WHERE id = ?";
        return this.jdbcTemplate.queryForObject(sql, new RestaurantRowMapper(), id);
    }

    @Override
    public int addRestaurantDetails(RestaurantDetailsRequest details, double longitude, double latitude, String photoUrl, int managerId) {
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
            ps.setInt(15, managerId);
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
    public void updateMainPhotoUrl(int id, String mainPhotoUrl) {
        String sql = "UPDATE restaurants SET main_photo_url = ? WHERE id = ?";
        jdbcTemplate.update(sql, mainPhotoUrl, id);
    }
}
