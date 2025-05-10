package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.Restaurant;
import org.springframework.data.geo.Point;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import static com.sjsu.booktable.utils.SQLUtils.hasColumn;

public class RestaurantRowMapper implements RowMapper<Restaurant> {

    @Override
    public Restaurant mapRow(ResultSet rs, int rowNum) throws SQLException {
        Point point = null;
        if (hasColumn(rs, "longitude") && hasColumn(rs, "latitude")) {
            point = new Point(rs.getDouble("longitude"), rs.getDouble("latitude"));
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
                .location(point)
                .mainPhotoUrl(rs.getString("main_photo_url"))
                .createdAt(rs.getTimestamp("created_at"))
                .updatedAt(rs.getTimestamp("updated_at"))
                .approved(rs.getBoolean("approved"))
                .managerId(rs.getString("manager_id"))
                .deleted(rs.getBoolean("deleted"))
                .build();
    }
}
