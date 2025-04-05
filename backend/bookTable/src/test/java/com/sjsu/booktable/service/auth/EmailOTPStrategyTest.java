package com.sjsu.booktable.service.auth;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import com.sjsu.booktable.exception.auth.OtpSendFailedException;
import com.sjsu.booktable.model.dto.SendOTPRequest;
import com.sjsu.booktable.model.dto.SendOTPResponse;
import com.sjsu.booktable.model.dto.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.VerifyOTPResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailOTPStrategyTest {

    @Mock
    private AWSCognitoIdentityProvider cognitoClient;

    private EmailOTPStrategy emailOtpStrategy;

    @BeforeEach
    void setUp() {
        emailOtpStrategy = new EmailOTPStrategy(cognitoClient);
        ReflectionTestUtils.setField(emailOtpStrategy, "userPoolId", "test-pool-id");
        ReflectionTestUtils.setField(emailOtpStrategy, "clientId", "test-client-id");
        ReflectionTestUtils.setField(emailOtpStrategy, "clientSecret", "test-client-secret");
    }

    @Test
    void sendOtp_ForNewUser_ShouldCreateUserAndSendOtp() {
        // Arrange
        SendOTPRequest request = new SendOTPRequest();
        request.setValue("newuser@example.com");
        String username = "newuser@example.com";
        String session = "test-session";

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenThrow(new UserNotFoundException("User not found"));
        when(cognitoClient.listUsers(any(ListUsersRequest.class)))
                .thenReturn(new ListUsersResult().withUsers(new ArrayList<>())); // Initialize empty list
        when(cognitoClient.adminInitiateAuth(any(AdminInitiateAuthRequest.class)))
                .thenReturn(new AdminInitiateAuthResult().withSession(session));

        // Act
        SendOTPResponse response = emailOtpStrategy.sendOtp(request);

        // Assert
        assertNotNull(response);
        assertEquals(session, response.getSession());
        verify(cognitoClient).adminCreateUser(any(AdminCreateUserRequest.class));
        verify(cognitoClient).adminInitiateAuth(any(AdminInitiateAuthRequest.class));
    }

    @Test
    void sendOtp_ForExistingUser_ShouldUpdateUserAndSendOtp() {
        // Arrange
        SendOTPRequest request = new SendOTPRequest();
        request.setValue("existing@example.com");
        String username = "existinguser";
        String session = "test-session";

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(new AdminGetUserResult().withUserAttributes(new ArrayList<>()));
        when(cognitoClient.adminInitiateAuth(any(AdminInitiateAuthRequest.class)))
                .thenReturn(new AdminInitiateAuthResult().withSession(session));

        // Act
        SendOTPResponse response = emailOtpStrategy.sendOtp(request);

        // Assert
        assertNotNull(response);
        assertEquals(session, response.getSession());
        verify(cognitoClient).adminUpdateUserAttributes(any(AdminUpdateUserAttributesRequest.class));
        verify(cognitoClient).adminInitiateAuth(any(AdminInitiateAuthRequest.class));
    }

    @Test
    void sendOtp_WhenCognitoFails_ShouldThrowOtpSendFailedException() {
        // Arrange
        SendOTPRequest request = new SendOTPRequest();
        request.setValue("test@example.com");

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenThrow(new RuntimeException("Cognito error"));

        // Act & Assert
        assertThrows(OtpSendFailedException.class, () -> emailOtpStrategy.sendOtp(request));
    }

    @Test
    void verifyOtp_WithValidOtp_ShouldReturnTokens() {
        // Arrange
        VerifyOTPRequest request = new VerifyOTPRequest();
        request.setValue("test@example.com");
        request.setOtp("123456");
        request.setSession("test-session");
        String username = "testuser";
        String idToken = "test-id-token";
        String accessToken = "test-access-token";

        List<AttributeType> userAttributes = new ArrayList<>();
        userAttributes.add(new AttributeType().withName("email_verified").withValue("true"));

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(new AdminGetUserResult().withUserAttributes(userAttributes));
        when(cognitoClient.adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class)))
                .thenReturn(new AdminRespondToAuthChallengeResult()
                        .withAuthenticationResult(new AuthenticationResultType()
                                .withIdToken(idToken)
                                .withAccessToken(accessToken)));

        // Act
        VerifyOTPResponse response = emailOtpStrategy.verifyOtp(request);

        // Assert
        assertNotNull(response);
        assertEquals(idToken, response.getIdToken());
        assertEquals(accessToken, response.getAccessToken());
        verify(cognitoClient).adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class));
    }

    @Test
    void verifyOtp_WithInvalidOtp_ShouldReturnSessionForRetry() {
        // Arrange
        VerifyOTPRequest request = new VerifyOTPRequest();
        request.setValue("test@example.com");
        request.setOtp("123456");
        request.setSession("test-session");
        String newSession = "new-session";

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(new AdminGetUserResult().withUserAttributes(new ArrayList<>()));
        when(cognitoClient.adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class)))
                .thenReturn(new AdminRespondToAuthChallengeResult()
                        .withSession(newSession));

        // Act
        VerifyOTPResponse response = emailOtpStrategy.verifyOtp(request);

        // Assert
        assertNotNull(response);
        assertEquals(newSession, response.getSession());
        assertEquals("Invalid OTP, please try again", response.getMessage());
        verify(cognitoClient).adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class));
    }

    @Test
    void verifyOtp_WhenNotAuthorized_ShouldReturnErrorMessage() {
        // Arrange
        VerifyOTPRequest request = new VerifyOTPRequest();
        request.setValue("test@example.com");
        request.setOtp("123456");
        request.setSession("test-session");

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(new AdminGetUserResult().withUserAttributes(new ArrayList<>()));
        when(cognitoClient.adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class)))
                .thenThrow(new NotAuthorizedException("Invalid credentials"));

        // Act
        VerifyOTPResponse response = emailOtpStrategy.verifyOtp(request);

        // Assert
        assertNotNull(response);
        assertTrue(response.getMessage().contains("Authentication failed"));
        verify(cognitoClient).adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class));
    }
} 