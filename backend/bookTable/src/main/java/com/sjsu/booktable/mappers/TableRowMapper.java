package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.TableEntity;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TableRowMapper implements RowMapper<TableEntity> {

    @Override
    public TableEntity mapRow(ResultSet rs, int rowNum) throws SQLException {
        TableEntity tableEntity = new TableEntity();
        tableEntity.setId(rs.getInt("id"));
        tableEntity.setRestaurantId(rs.getInt("restaurant_id"));
        tableEntity.setSize(rs.getInt("size"));
        tableEntity.setQuantity(rs.getInt("quantity"));
        return tableEntity;
    }
}
