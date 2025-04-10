package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.entity.Photo;

import java.util.List;

public interface PhotosRepository {

    int insertPhoto(Photo photo);

    List<Photo> getPhotosByRestaurantId(int restaurantId);

}
