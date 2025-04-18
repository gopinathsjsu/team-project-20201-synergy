package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.entity.Photo;
import com.sjsu.booktable.repository.PhotosRepository;
import com.sjsu.booktable.utils.ListUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PhotoServiceImpl implements PhotoService {

    private final PhotosRepository photosRepository;

    @Override
    public void addPhoto(Photo photo) {
        photosRepository.insertPhoto(photo);
    }

    @Override
    public List<Photo> getPhotosByRestaurantId(int restaurantId) {
        List<Photo> photos = ListUtils.nullSafeList(photosRepository.getPhotosByRestaurantId(restaurantId));
        return photos;
    }

    @Override
    public void deletePhotoByRestaurantIdAndS3Url(int restaurantId, List<String> s3Urls) {
        photosRepository.deleteByRestaurantIdAndS3Url(restaurantId, s3Urls);
    }


}
