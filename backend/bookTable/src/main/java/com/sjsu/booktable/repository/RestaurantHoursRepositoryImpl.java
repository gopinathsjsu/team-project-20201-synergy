package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.HoursRowMapper;
import com.sjsu.booktable.model.dto.restaurant.HoursDto;
import com.sjsu.booktable.model.entity.RestaurantHours;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Time;
import java.util.List;

@Repository
public class RestaurantHoursRepositoryImpl implements RestaurantHoursRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void insertHours(int restaurantId, List<HoursDto> hoursList) {
        String sql = "INSERT INTO hours (restaurant_id, day_of_week, open_time, close_time) VALUES (?, ?, ?, ?)";

        this.jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                HoursDto hd = hoursList.get(i);
                ps.setInt(1, restaurantId);
                ps.setInt(2, hd.getDayOfWeek());
                Time openTime = (hd.getOpenTime() == null) ? null : Time.valueOf(hd.getOpenTime());
                ps.setTime(3, openTime);
                Time closeTime = (hd.getCloseTime() == null) ? null : Time.valueOf(hd.getCloseTime());
                ps.setTime(4, closeTime);
            }
            @Override
            public int getBatchSize() {
                return hoursList.size();
            }
        });
    }

    @Override
    public void deleteByRestaurantId(int restaurantId) {
        String sql = "DELETE FROM hours WHERE restaurant_id = ?";
        jdbcTemplate.update(sql, restaurantId);
    }

    @Override
    public RestaurantHours getHoursByRestaurantAndDay(int restaurantId, int dayOfWeek) {
        String sql = "SELECT * FROM hours WHERE restaurant_id = ? AND day_of_week = ?";
        return jdbcTemplate.queryForObject(sql, new HoursRowMapper(), restaurantId, dayOfWeek);
    }

    @Override
    public List<RestaurantHours> getHoursByRestaurantId(int restaurantId) {
        String sql = "SELECT * FROM hours WHERE restaurant_id = ?";
        return jdbcTemplate.query(sql, new HoursRowMapper(), restaurantId);
    }
}
