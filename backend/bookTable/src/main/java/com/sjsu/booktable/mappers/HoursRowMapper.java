package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.RestaurantHours;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class HoursRowMapper implements RowMapper<RestaurantHours> {

    @Override
    public RestaurantHours mapRow(ResultSet rs, int rowNum) throws SQLException {
        RestaurantHours hours = new RestaurantHours();
        hours.setId(rs.getInt("id"));
        hours.setRestaurantId(rs.getInt("restaurant_id"));
        hours.setDayOfWeek(rs.getInt("day_of_week"));
        hours.setOpenTime(rs.getTime("open_time"));
        hours.setCloseTime(rs.getTime("close_time"));
        return hours;
    }
}
