package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.exception.restaurant.PhotoUploadException;
import com.sjsu.booktable.model.entity.Photo;
import com.sjsu.booktable.repository.PhotosRepository;
import com.sjsu.booktable.service.s3.S3Service;
import com.sjsu.booktable.validator.RestaurantValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class PhotoServiceImpl implements PhotoService {

    private final PhotosRepository photosRepository;
    private final S3Service s3Service;
    private final RestaurantValidator validator;

    @Override
    public void addPhoto(Photo photo) {
        photosRepository.insertPhoto(photo);
    }

    public String uploadPhotoInS3(MultipartFile mainPhoto, String folder) {
        validator.validateImageFile(mainPhoto);
        try {
            return s3Service.uploadFile(mainPhoto, folder);
        } catch (IOException e) {
            log.error("Failed to upload photo ", e);
            throw new PhotoUploadException("Failed to upload photo in folder - " + folder + "::", e);
        }
    }

    @Override
    public String movePhotoToDifferentPath(String sourcePath, String destPath) {
        s3Service.moveFile(sourcePath, destPath);
        return s3Service.getFileUrl(destPath);
    }

}
