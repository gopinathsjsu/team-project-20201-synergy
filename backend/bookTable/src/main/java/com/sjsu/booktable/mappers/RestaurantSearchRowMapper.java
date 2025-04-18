package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.dto.restaurantSearch.RestaurantSearchDetails;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import static com.sjsu.booktable.utils.RestaurantUtil.getFormattedAddress;
import static com.sjsu.booktable.utils.SQLUtils.hasColumn;

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
        String address = getFormattedAddress(rs.getString("address_line"), rs.getString("city"),
                rs.getString("state"), rs.getString("zip_code"));
        searchDetails.setAddress(address);

        searchDetails.setMainPhotoUrl(rs.getString("main_photo_url"));

        // Check if the distance column exists in the ResultSet
        if (hasColumn(rs, "distance")) {
            double distanceMeters = rs.getDouble("distance");
            double distanceMiles = distanceMeters / METERS_PER_MILE;
            searchDetails.setDistance(distanceMiles);
        } else {
            searchDetails.setDistance(null);
        }

        // Check for approved column and set it if exists
        if (hasColumn(rs, "approved")) {
            searchDetails.setApproved(rs.getBoolean("approved"));
        } else {
            searchDetails.setApproved(null);
        }

        return searchDetails;
    }

}
