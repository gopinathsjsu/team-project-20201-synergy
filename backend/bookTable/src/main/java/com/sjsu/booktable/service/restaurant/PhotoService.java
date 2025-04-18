package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.entity.Photo;
import java.util.List;

public interface PhotoService {

    void addPhoto(Photo photo);

    List<Photo> getPhotosByRestaurantId(int restaurantId);

    void deletePhotoByRestaurantIdAndS3Url(int restaurantId, List<String> s3Urls);

}
