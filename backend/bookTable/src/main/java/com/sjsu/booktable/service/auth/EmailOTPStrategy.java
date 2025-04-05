package com.sjsu.booktable.service.auth;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import com.sjsu.booktable.exception.auth.OtpSendFailedException;
import com.sjsu.booktable.exception.auth.OtpVerificationFailedException;
import com.sjsu.booktable.model.dto.SendOTPRequest;
import com.sjsu.booktable.model.dto.SendOTPResponse;
import com.sjsu.booktable.model.dto.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.VerifyOTPResponse;
import com.sjsu.booktable.utils.JsonUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class EmailOTPStrategy extends BaseOTPStrategy {

    public EmailOTPStrategy(AWSCognitoIdentityProvider cognitoClient) {
        super(cognitoClient);
    }

    @Override
    public SendOTPResponse sendOtp(SendOTPRequest request) {
        try {
            String username = resolveUsername(request.getValue(), "email");
            if (username == null) {
                username = request.getValue();
                cognitoClient.adminCreateUser(new AdminCreateUserRequest()
                        .withUserPoolId(userPoolId)
                        .withUsername(username)
                        .withUserAttributes(
                                new AttributeType().withName("email").withValue(request.getValue()),
                                new AttributeType().withName("email_verified").withValue("true"),
                                new AttributeType().withName("custom:login_method").withValue("email")
                        )
                        .withMessageAction(MessageActionType.SUPPRESS));
            } else {
                // Update for existing user
                cognitoClient.adminUpdateUserAttributes(new AdminUpdateUserAttributesRequest()
                        .withUserPoolId(userPoolId)
                        .withUsername(username)
                        .withUserAttributes(
                                new AttributeType().withName("custom:login_method").withValue("email")
                        ));
            }

            AdminInitiateAuthRequest authRequest = new AdminInitiateAuthRequest()
                    .withAuthFlow(AuthFlowType.CUSTOM_AUTH)
                    .withUserPoolId(userPoolId)
                    .withClientId(clientId)
                    .withAuthParameters(Map.of(
                            "USERNAME", username,
                            "SECRET_HASH", calculateSecretHash(username)

                    ));

            AdminInitiateAuthResult result = cognitoClient.adminInitiateAuth(authRequest);
            log.info("Email OTP sent through Cognito: {}", JsonUtil.toJson(result));

            SendOTPResponse response = new SendOTPResponse();
            response.setSession(result.getSession());
            return response;
        } catch (Exception e) {
            throw new OtpSendFailedException(e.getMessage());
        }
    }

    @Override
    public VerifyOTPResponse verifyOtp(VerifyOTPRequest request) {
        try {
            String username = resolveUsername(request.getValue(), "email");
            if (username == null) {
                throw new Exception("User not found after OTP send");
            }

            AdminRespondToAuthChallengeRequest authRequest = new AdminRespondToAuthChallengeRequest()
                    .withUserPoolId(userPoolId)
                    .withClientId(clientId)
                    .withChallengeName("CUSTOM_CHALLENGE")
                    .withSession(request.getSession())
                    .withChallengeResponses(Map.of(
                            "USERNAME", username,
                            "ANSWER", request.getOtp(),
                            "SECRET_HASH", calculateSecretHash(username)
                    ));

            AdminRespondToAuthChallengeResult result = cognitoClient.adminRespondToAuthChallenge(authRequest);
            log.info("Email OTP verified through Cognito: {}", JsonUtil.toJson(result));

            VerifyOTPResponse response = new VerifyOTPResponse();

            if (result.getAuthenticationResult() != null) {
                response.setIdToken(result.getAuthenticationResult().getIdToken());
                response.setAccessToken(result.getAuthenticationResult().getAccessToken());
                response.setRequiresRegistration(checkRegistrationStatus(username));

                AdminGetUserResult user = cognitoClient.adminGetUser(new AdminGetUserRequest()
                        .withUserPoolId(userPoolId).withUsername(username));
                boolean emailVerified = user.getUserAttributes().stream()
                        .anyMatch(attr -> "email_verified".equals(attr.getName()) && "true".equals(attr.getValue()));
                if (!emailVerified) {
                    cognitoClient.adminUpdateUserAttributes(new AdminUpdateUserAttributesRequest()
                            .withUserPoolId(userPoolId)
                            .withUsername(username)
                            .withUserAttributes(new AttributeType().withName("email_verified").withValue("true")));
                }
            } else {
                // OTP failed, return new session for retry
                response.setSession(result.getSession());
                response.setMessage("Invalid OTP, please try again");
            }

            return response;
        } catch (NotAuthorizedException e) {
            log.error("Cognito auth error: {}", e.getMessage());
            VerifyOTPResponse response = new VerifyOTPResponse();
            response.setMessage("Authentication failed: " + e.getMessage());
            return response;
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage());
            VerifyOTPResponse response = new VerifyOTPResponse();
            response.setMessage("An error occurred: " + e.getMessage());
            return response;
        }
    }

}