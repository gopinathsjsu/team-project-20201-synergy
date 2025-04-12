package com.sjsu.booktable.service.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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

    @BeforeEach
    void setUp() {
        s3Service = new S3Service(s3Client);
        ReflectionTestUtils.setField(s3Service, "bucketName", BUCKET_NAME);
    }

    @Test
    void uploadFile_Success() throws IOException {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "file",
                FILE_NAME,
                "image/jpeg",
                "test content".getBytes()
        );
        String expectedKey = FOLDER + "/" + FILE_NAME;
        when(s3Client.getUrl(eq(BUCKET_NAME), anyString())).thenReturn(new URL(FILE_URL));

        // Act
        String result = s3Service.uploadFile(file, FOLDER);

        // Assert
        assertNotNull(result);
        assertEquals(FILE_URL, result);
        verify(s3Client).putObject(eq(BUCKET_NAME), anyString(), any(File.class));
    }

    @Test
    void uploadFile_InvalidFilename() {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "file",
                "../test.jpg",
                "image/jpeg",
                "test content".getBytes()
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> s3Service.uploadFile(file, FOLDER));
        verify(s3Client, never()).putObject(eq(BUCKET_NAME), anyString(), any(File.class));
    }

    @Test
    void moveFile_Success() {
        // Arrange
        String sourceKey = "source/key";
        String destKey = "dest/key";

        // Act
        s3Service.moveFile(sourceKey, destKey);

        // Assert
        verify(s3Client).copyObject(any(CopyObjectRequest.class));
        verify(s3Client).deleteObject(BUCKET_NAME, sourceKey);
    }

    @Test
    void getFileUrl_Success() {
        // Arrange
        String key = "test/key";
        try {
            when(s3Client.getUrl(eq(BUCKET_NAME), eq(key))).thenReturn(new URL(FILE_URL));
        } catch (MalformedURLException e) {
            throw new RuntimeException("Invalid URL format: " + FILE_URL, e);
        }

        // Act
        String result = s3Service.getFileUrl(key);

        // Assert
        assertNotNull(result);
        assertEquals(FILE_URL, result);
    }
} 