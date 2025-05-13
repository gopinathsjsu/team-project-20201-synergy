package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.service.s3.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
@Slf4j
public class S3Controller {

    private final S3Service s3Service;

    @PostMapping("/presigned-url/batch")
    public ResponseEntity getBatchPresignedUrls(@RequestBody List<String> keys,
                                                @RequestParam(required = false, defaultValue = "60") int expiration) {
        try {
            List<String> uniqueKeys = keys.stream().distinct().toList();
            Map<String, URL> urls = uniqueKeys.stream()
                    .collect(Collectors.toMap(
                            key -> key,
                            key -> s3Service.generatePresignedGetUrl(key, expiration)
                    ));
            return ResponseEntity.ok(BTResponse.success(urls));
        } catch (Exception e) {
            log.error("error with presigned url generation: ", e);
            return ResponseEntity.internalServerError().body(BTResponse.failure("Error generating pre-signed URLs"));
        }

    }
}
