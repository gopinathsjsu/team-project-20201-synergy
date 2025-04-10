package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.restaurant.TableRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class TableRepositoryImpl implements TableRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void insertTables(int restaurantId, List<TableRequest> tableRequests) {
        String sql = "INSERT INTO tables (restaurant_id, size, quantity) VALUES (?, ?, ?)";

        this.jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                TableRequest tr = tableRequests.get(i);
                ps.setInt(1, restaurantId);
                ps.setInt(2, tr.getSize());
                ps.setInt(3, tr.getQuantity());
            }

            @Override
            public int getBatchSize() {
                return tableRequests.size();
            }
        });
    }

    @Override
    public void deleteByRestaurantId(int restaurantId) {
        String sql = "DELETE FROM tables WHERE restaurant_id = ?";
        jdbcTemplate.update(sql, restaurantId);
    }
}
