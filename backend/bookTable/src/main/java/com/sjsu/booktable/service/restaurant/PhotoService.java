package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.entity.Photo;
import org.springframework.web.multipart.MultipartFile;

public interface PhotoService {

    void addPhoto(Photo photo);

    String uploadPhotoInS3(MultipartFile mainPhoto, String folder);

    String movePhotoToDifferentPath(String sourcePath, String destPath);
}
