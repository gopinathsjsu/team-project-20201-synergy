package com.sjsu.booktable.service.auth;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public abstract class BaseOTPStrategy implements OTPStrategy {

    protected final AWSCognitoIdentityProvider cognitoClient;

    @Value("${cognito.userPoolId}") protected String userPoolId;
    @Value("${cognito.clientId}") protected String clientId;
    @Value("${cognito.clientSecret}") protected String clientSecret;

    public BaseOTPStrategy(AWSCognitoIdentityProvider cognitoClient) {
        this.cognitoClient = cognitoClient;
    }

    protected String resolveUsername(String value, String attributeName) {
        try {
            cognitoClient.adminGetUser(new AdminGetUserRequest()
                    .withUserPoolId(userPoolId)
                    .withUsername(value));
            return value;
        } catch (UserNotFoundException e) {
            ListUsersRequest listRequest = new ListUsersRequest()
                    .withUserPoolId(userPoolId)
                    .withFilter(attributeName + " = \"" + value + "\"");
            ListUsersResult result = cognitoClient.listUsers(listRequest);
            return !result.getUsers().isEmpty() ? result.getUsers().get(0).getUsername() : null;
        }
    }

    protected boolean checkRegistrationStatus(String username) {
        AdminGetUserResult user = cognitoClient.adminGetUser(new AdminGetUserRequest()
                .withUserPoolId(userPoolId)
                .withUsername(username));
        return user.getUserAttributes().stream()
                .noneMatch(attr -> "custom:registered".equals(attr.getName()) && "true".equals(attr.getValue()));
    }

    protected String calculateSecretHash(String username) {
        try {
            String data = username + clientId;
            SecretKeySpec signingKey = new SecretKeySpec(clientSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating SECRET_HASH", e);
        }
    }

}
