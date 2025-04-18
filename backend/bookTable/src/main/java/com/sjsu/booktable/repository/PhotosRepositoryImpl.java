package com.sjsu.booktable.repository;

import com.sjsu.booktable.mappers.PhotosRowMapper;
import com.sjsu.booktable.model.entity.Photo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.sjsu.booktable.utils.SQLUtils.buildPlaceholders;

@Repository
public class PhotosRepositoryImpl implements PhotosRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int insertPhoto(Photo photo) {
        String sql = "INSERT INTO photos (restaurant_id, s3_url, description, uploaded_at) VALUES (?, ?, ?, ?)";
        return this.jdbcTemplate.update(sql,
                photo.getRestaurantId(),
                photo.getS3URL(),
                photo.getDescription(),
                photo.getUploadedAt()
        );
    }

    @Override
    public List<Photo> getPhotosByRestaurantId(int restaurantId) {
        String sql = "SELECT * FROM photos WHERE restaurant_id = ?";
        return this.jdbcTemplate.query(sql, new PhotosRowMapper(), restaurantId);
    }

    @Override
    public void deleteByRestaurantIdAndS3Url(int restaurantId, List<String> s3Urls) {
        if (s3Urls.isEmpty()) {
            return;
        }

        String sql = "DELETE FROM photos WHERE restaurant_id = ? AND s3_url IN (" + buildPlaceholders(s3Urls) + ")";

        Object[] params = new Object[s3Urls.size() + 1];
        params[0] = restaurantId;

        int index = 1;
        for(String s3Url : s3Urls) {
            params[index++] = s3Url;
        }
        this.jdbcTemplate.update(sql, params);
    }
}
