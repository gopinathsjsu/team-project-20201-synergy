package com.sjsu.booktable.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
public class AWSCognitoConfig {

    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretKey}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

    @Bean
    public AWSCognitoIdentityProvider cognitoClient() {
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretKey);
        return AWSCognitoIdentityProviderClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.fromName(region))
                .build();
    }

}
