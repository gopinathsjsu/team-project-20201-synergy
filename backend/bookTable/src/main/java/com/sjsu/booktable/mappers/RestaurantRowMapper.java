package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.Restaurant;
import org.springframework.data.geo.Point;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/* Here rowmapper is used to map the result set to the restaurant(ENTITY) object */
public class RestaurantRowMapper implements RowMapper<Restaurant> {

    @Override
    public Restaurant mapRow(ResultSet rs, int rowNum) throws SQLException {
        String locationStr = rs.getString("location");
        Point location = null;
        if (locationStr != null && locationStr.startsWith("POINT(")) {
            String coords = locationStr.substring(6, locationStr.length() - 1);
            String[] parts = coords.split(" ");
            double lng = Double.parseDouble(parts[0]);
            double lat = Double.parseDouble(parts[1]);
            location = new Point(lng, lat);
        }

        return Restaurant.builder()
                .id(rs.getInt("id"))
                .name(rs.getString("name"))
                .cuisineType(rs.getString("cuisine_type"))
                .costRating(rs.getInt("cost_rating"))
                .description(rs.getString("description"))
                .contactPhone(rs.getString("contact_phone"))
                .addressLine(rs.getString("address_line"))
                .city(rs.getString("city"))
                .state(rs.getString("state"))
                .zipCode(rs.getString("zip_code"))
                .country(rs.getString("country"))
                .location(location)
                .mainPhotoUrl(rs.getString("main_photo_url"))
                .createdAt(rs.getTimestamp("created_at"))
                .updatedAt(rs.getTimestamp("updated_at"))
                .approved(rs.getBoolean("approved"))
                .managerId(rs.getInt("manager_id"))
                .deleted(rs.getBoolean("deleted"))
                .build();
    }
}
