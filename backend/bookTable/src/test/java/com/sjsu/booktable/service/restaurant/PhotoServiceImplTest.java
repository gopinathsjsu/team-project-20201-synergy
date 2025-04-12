package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.exception.restaurant.PhotoUploadException;
import com.sjsu.booktable.model.entity.Photo;
import com.sjsu.booktable.repository.PhotosRepository;
import com.sjsu.booktable.service.s3.S3Service;
import com.sjsu.booktable.validator.RestaurantValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PhotoServiceImplTest {

    @Mock
    private PhotosRepository photosRepository;

    @Mock
    private S3Service s3Service;

    @Mock
    private RestaurantValidator validator;

    @InjectMocks
    private PhotoServiceImpl photoService;

    private Photo photo;
    private MultipartFile multipartFile;

    @BeforeEach
    void setUp() {
        photo = Photo.builder()
                .id(1)
                .restaurantId(1)
                .s3URL("https://example.com/photo.jpg")
                .description("Test photo")
                .uploadedAt(new Timestamp(System.currentTimeMillis()))
                .build();

        multipartFile = new MockMultipartFile(
                "test.jpg",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );
    }

    @Test
    void addPhoto_Success() {
        // Act
        photoService.addPhoto(photo);

        // Assert
        verify(photosRepository).insertPhoto(eq(photo));
    }

    @Test
    void uploadPhotoInS3_Success() throws IOException {
        // Arrange
        String expectedUrl = "https://s3.example.com/restaurants/1/test.jpg";
        when(s3Service.uploadFile(any(MultipartFile.class), anyString()))
                .thenReturn(expectedUrl);

        // Act
        String result = photoService.uploadPhotoInS3(multipartFile, "restaurants/1");

        // Assert
        assertEquals(expectedUrl, result);
        verify(validator).validateImageFile(eq(multipartFile));
        verify(s3Service).uploadFile(eq(multipartFile), eq("restaurants/1"));
    }

    @Test
    void uploadPhotoInS3_IOException() throws IOException {
        // Arrange
        when(s3Service.uploadFile(any(MultipartFile.class), anyString()))
                .thenThrow(new IOException("Failed to upload"));

        // Act & Assert
        PhotoUploadException exception = assertThrows(PhotoUploadException.class,
                () -> photoService.uploadPhotoInS3(multipartFile, "restaurants/1"));

        assertEquals("Failed to upload photo in folder - restaurants/1::", exception.getMessage());
        assertTrue(exception.getCause() instanceof IOException);
    }

    @Test
    void movePhotoToDifferentPath_Success() {
        // Arrange
        String sourcePath = "old/path/photo.jpg";
        String destPath = "new/path/photo.jpg";
        String expectedUrl = "https://s3.example.com/new/path/photo.jpg";
        when(s3Service.getFileUrl(eq(destPath))).thenReturn(expectedUrl);

        // Act
        String result = photoService.movePhotoToDifferentPath(sourcePath, destPath);

        // Assert
        assertEquals(expectedUrl, result);
        verify(s3Service).moveFile(eq(sourcePath), eq(destPath));
        verify(s3Service).getFileUrl(eq(destPath));
    }
} 