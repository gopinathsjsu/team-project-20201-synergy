package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.entity.Photo;

import java.util.List;

public interface PhotosRepository {

    int insertPhoto(Photo photo);

    List<Photo> getPhotosByRestaurantId(int restaurantId);

    void deleteByRestaurantIdAndS3Url(int restaurantId, List<String> s3Urls);

}
