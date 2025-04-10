package com.sjsu.booktable.service.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String fileName = folder + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
        File tempFile = convertMultipartFileToFile(file);
        s3Client.putObject(bucketName, fileName, tempFile);
        tempFile.delete();
        return s3Client.getUrl(bucketName, fileName).toString();
    }

    public void moveFile(String sourceKey, String destKey) {
        CopyObjectRequest copyRequest = new CopyObjectRequest(bucketName, sourceKey, bucketName, destKey);
        s3Client.copyObject(copyRequest);
        s3Client.deleteObject(bucketName, sourceKey);
    }

    public String getFileUrl(String key) {
        return s3Client.getUrl(bucketName, key).toString();
    }

    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        validateFilename(Objects.requireNonNull(file.getOriginalFilename()));
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

    private void validateFilename(String filename) {
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            throw new IllegalArgumentException("Invalid filename for image :: " + filename);
        }
    }

}
