package com.sjsu.booktable.service.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectsRequest;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Date;
import java.util.List;
import java.net.URL;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public URL generatePresignedUrl(String folder, String fileName, int expirationInMinutes) {
        String key = folder + "/" + fileName;
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime() + ((long) expirationInMinutes * 60 * 1000);
        expiration.setTime(expTimeMillis);
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, key)
                .withMethod(HttpMethod.PUT)
                .withExpiration(expiration);
        URL url = s3Client.generatePresignedUrl(request);
        log.info("Generated pre-signed URL for key {}: {}", key, url.toString());
        return url;
    }

    public URL generatePresignedGetUrl(String key, int expirationInMinutes) {
        try {
            Date expiration = new Date();
            long expTimeMillis = expiration.getTime() + ((long) expirationInMinutes * 60 * 1000);
            expiration.setTime(expTimeMillis);
            GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, key)
                    .withMethod(HttpMethod.GET)
                    .withExpiration(expiration);
            URL url = s3Client.generatePresignedUrl(request);
            log.info("Generated pre-signed GET URL for key {}: {}", key, url.toString());
            return url;
        } catch (Exception e) {
            log.error("Error generating pre-signed GET URL for {} : {}", key, e.getMessage());
            return null;
        }
    }

    /**
     * Deletes multiple files from S3 in one call.
     *
     * @param keys List of S3 object keys to delete.
     */
    public void deleteFilesBulk(List<String> keys) {
        if(CollectionUtils.isEmpty(keys)) {
            log.warn("No keys provided for bulk deletion.");
            return;
        }

        List<DeleteObjectsRequest.KeyVersion> keyVersions = keys.stream().map(DeleteObjectsRequest.KeyVersion::new).toList();
        DeleteObjectsRequest delReq = new DeleteObjectsRequest(bucketName)
                .withKeys(keyVersions);
        s3Client.deleteObjects(delReq);
        log.info("Bulk deleted keys: {}", keys);
    }

}
