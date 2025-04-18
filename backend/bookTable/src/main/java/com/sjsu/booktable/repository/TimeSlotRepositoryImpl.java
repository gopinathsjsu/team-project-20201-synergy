package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.TimeSlotRowMapper;
import com.sjsu.booktable.model.dto.restaurant.TimeSlotDto;
import com.sjsu.booktable.model.entity.TimeSlot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TimeSlotRepositoryImpl implements TimeSlotRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void insertTimeSlots(int restaurantId, List<TimeSlotDto> timeSlotDtos) {
        String sql = "INSERT INTO time_slots (restaurant_id, day_of_week, slot_time) VALUES (?, ?, ?)";
        List<Object[]> batchArgs = new ArrayList<>();
        for (TimeSlotDto dto : timeSlotDtos) {
            int day = dto.getDayOfWeek();
            for (LocalTime time : dto.getTimes()) {
                batchArgs.add(new Object[]{restaurantId, day, Time.valueOf(time)});
            }
        }

        this.jdbcTemplate.batchUpdate(sql, batchArgs);
    }

    @Override
    public void deleteByRestaurantId(int restaurantId) {
        String sql = "DELETE FROM time_slots WHERE restaurant_id = ?";
        jdbcTemplate.update(sql, restaurantId);
    }

    @Override
    public List<LocalTime> getTimeSlotsByRestaurantAndDay(int restaurantId, int dayOfWeek) {
        String sql = "SELECT slot_time FROM time_slots WHERE restaurant_id = ? AND day_of_week = ? ORDER BY slot_time ";
        return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getTime("slot_time").toLocalTime(), restaurantId, dayOfWeek);
    }

    @Override
    public List<TimeSlot> getTimeSlotsByRestaurantId(int restaurantId) {
        String sql = "SELECT * FROM time_slots WHERE restaurant_id = ? ORDER BY day_of_week, slot_time";
        return jdbcTemplate.query(sql, new TimeSlotRowMapper(), restaurantId);
    }
}
