package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.TimeSlot;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TimeSlotRowMapper implements RowMapper<TimeSlot> {

    @Override
    public TimeSlot mapRow(ResultSet rs, int rowNum) throws SQLException {
        TimeSlot slot = new TimeSlot();
        slot.setId(rs.getInt("id"));
        slot.setRestaurantId(rs.getInt("restaurant_id"));
        slot.setDayOfWeek(rs.getInt("day_of_week"));
        slot.setSlotTime(rs.getTime("slot_time"));
        return slot;
    }
}
