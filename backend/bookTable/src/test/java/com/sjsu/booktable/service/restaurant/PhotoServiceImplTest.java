package com.sjsu.booktable.service.restaurant;

import com.sjsu.booktable.model.entity.Photo;
import com.sjsu.booktable.repository.PhotosRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PhotoServiceImplTest {

    @Mock
    private PhotosRepository photosRepository;

    @InjectMocks
    private PhotoServiceImpl photoService;

    private Photo photo;

    @BeforeEach
    void setUp() {
        photo = Photo.builder()
                .id(1)
                .restaurantId(1)
                .s3URL("https://example.com/photo.jpg")
                .description("Test photo")
                .uploadedAt(new Timestamp(System.currentTimeMillis()))
                .build();
    }

    @Test
    void addPhoto_Success() {
        // Act
        photoService.addPhoto(photo);

        // Assert
        verify(photosRepository).insertPhoto(eq(photo));
    }

} 