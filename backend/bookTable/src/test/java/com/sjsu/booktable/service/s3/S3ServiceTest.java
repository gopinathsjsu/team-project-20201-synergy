package com.sjsu.booktable.service.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectsRequest;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.net.URL;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class S3ServiceTest {

    @Mock
    private AmazonS3 s3Client;

    @InjectMocks
    private S3Service s3Service;

    private static final String BUCKET_NAME = "test-bucket";
    private static final String FOLDER = "test-folder";
    private static final String FILE_NAME = "test.jpg";
    private static final String FILE_URL = "https://test-bucket.s3.amazonaws.com/test-folder/test.jpg";
    private static final int EXPIRATION_MINUTES = 5;

    @BeforeEach
    void setUp() {
        s3Service = new S3Service(s3Client);
        ReflectionTestUtils.setField(s3Service, "bucketName", BUCKET_NAME);
    }

    @Test
    void generatePresignedUrl_Success() throws Exception {
        // Arrange
        URL expectedUrl = new URL(FILE_URL);
        when(s3Client.generatePresignedUrl(any(GeneratePresignedUrlRequest.class)))
                .thenReturn(expectedUrl);

        // Act
        URL result = s3Service.generatePresignedUrl(FOLDER, FILE_NAME, EXPIRATION_MINUTES);

        // Assert
        assertNotNull(result);
        assertEquals(expectedUrl, result);
        
        ArgumentCaptor<GeneratePresignedUrlRequest> requestCaptor = ArgumentCaptor.forClass(GeneratePresignedUrlRequest.class);
        verify(s3Client).generatePresignedUrl(requestCaptor.capture());
        
        GeneratePresignedUrlRequest capturedRequest = requestCaptor.getValue();
        assertEquals(BUCKET_NAME, capturedRequest.getBucketName());
        assertEquals(FOLDER + "/" + FILE_NAME, capturedRequest.getKey());
        assertEquals(HttpMethod.PUT, capturedRequest.getMethod());
        assertTrue(capturedRequest.getExpiration().after(new Date()));
    }

    @Test
    void generatePresignedGetUrl_Success() throws Exception {
        // Arrange
        String key = FOLDER + "/" + FILE_NAME;
        URL expectedUrl = new URL(FILE_URL);
        when(s3Client.generatePresignedUrl(any(GeneratePresignedUrlRequest.class)))
                .thenReturn(expectedUrl);

        // Act
        URL result = s3Service.generatePresignedGetUrl(key, EXPIRATION_MINUTES);

        // Assert
        assertNotNull(result);
        assertEquals(expectedUrl, result);
        
        ArgumentCaptor<GeneratePresignedUrlRequest> requestCaptor = ArgumentCaptor.forClass(GeneratePresignedUrlRequest.class);
        verify(s3Client).generatePresignedUrl(requestCaptor.capture());
        
        GeneratePresignedUrlRequest capturedRequest = requestCaptor.getValue();
        assertEquals(BUCKET_NAME, capturedRequest.getBucketName());
        assertEquals(key, capturedRequest.getKey());
        assertEquals(HttpMethod.GET, capturedRequest.getMethod());
        assertTrue(capturedRequest.getExpiration().after(new Date()));
    }

    @Test
    void generatePresignedGetUrl_Error() {
        // Arrange
        String key = FOLDER + "/" + FILE_NAME;
        when(s3Client.generatePresignedUrl(any(GeneratePresignedUrlRequest.class)))
                .thenThrow(new RuntimeException("S3 Error"));

        // Act
        URL result = s3Service.generatePresignedGetUrl(key, EXPIRATION_MINUTES);

        // Assert
        assertNull(result);
    }

    @Test
    void deleteFilesBulk_Success() {
        // Arrange
        List<String> keys = Arrays.asList("key1", "key2", "key3");

        // Act
        s3Service.deleteFilesBulk(keys);

        // Assert
        ArgumentCaptor<DeleteObjectsRequest> requestCaptor = ArgumentCaptor.forClass(DeleteObjectsRequest.class);
        verify(s3Client).deleteObjects(requestCaptor.capture());
        
        DeleteObjectsRequest capturedRequest = requestCaptor.getValue();
        assertEquals(BUCKET_NAME, capturedRequest.getBucketName());
        assertEquals(3, capturedRequest.getKeys().size());
        assertTrue(capturedRequest.getKeys().stream()
                .map(DeleteObjectsRequest.KeyVersion::getKey)
                .allMatch(keys::contains));
    }

    @Test
    void deleteFilesBulk_EmptyList() {
        // Act
        s3Service.deleteFilesBulk(Collections.emptyList());

        // Assert
        verify(s3Client, never()).deleteObjects(any(DeleteObjectsRequest.class));
    }

    @Test
    void deleteFilesBulk_NullList() {
        // Act
        s3Service.deleteFilesBulk(null);

        // Assert
        verify(s3Client, never()).deleteObjects(any(DeleteObjectsRequest.class));
    }
} 