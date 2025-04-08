package com.sjsu.booktable.mappers;

import com.sjsu.booktable.model.entity.Photo;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class PhotosRowMapper implements RowMapper<Photo> {

    @Override
    public Photo mapRow(ResultSet rs, int rowNum) throws SQLException {
        return Photo.builder()
                .id(rs.getInt("id"))
                .restaurantId(rs.getInt("restaurant_id"))
                .s3URL(rs.getString("s3_url"))
                .description(rs.getString("description"))
                .uploadedAt(rs.getTimestamp("uploaded_at"))
                .build();
    }
}
