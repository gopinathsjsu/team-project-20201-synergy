package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import com.sjsu.booktable.utils.StringUtils;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RestaurantSearchRowMapper implements RowMapper<RestaurantSearchDetails> {

    private static final double METERS_PER_MILE = 1609.34;

    @Override
    public RestaurantSearchDetails mapRow(ResultSet rs, int rowNum) throws SQLException {
        RestaurantSearchDetails searchDetails = new RestaurantSearchDetails();
        searchDetails.setId(rs.getInt("id"));
        searchDetails.setName(rs.getString("name"));
        searchDetails.setCuisineType(rs.getString("cuisine_type"));
        searchDetails.setCostRating(rs.getInt("cost_rating"));

        // Construct a formatted address from individual columns.
        String address = StringUtils.nullSafeString(rs.getString("address_line")) + ", " +
                StringUtils.nullSafeString(rs.getString("city")) + ", " +
                StringUtils.nullSafeString(rs.getString("state")) + " " +
                StringUtils.nullSafeString(rs.getString("zip_code"));
        searchDetails.setAddress(address);

        searchDetails.setMainPhotoUrl(rs.getString("main_photo_url"));
        double distanceMeters = rs.getDouble("distance");
        double distanceMiles = distanceMeters / METERS_PER_MILE;
        searchDetails.setDistance(distanceMiles);
        return searchDetails;
    }
}
