package com.sjsu.booktable.service.auth;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import com.sjsu.booktable.exception.auth.OtpSendFailedException;
import com.sjsu.booktable.model.dto.auth.SendOTPRequest;
import com.sjsu.booktable.model.dto.auth.SendOTPResponse;
import com.sjsu.booktable.model.dto.auth.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.auth.VerifyOTPResponse;
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
class PhoneOTPStrategyTest {

    @Mock
    private AWSCognitoIdentityProvider cognitoClient;

    private PhoneOTPStrategy phoneOtpStrategy;

    @BeforeEach
    void setUp() {
        phoneOtpStrategy = new PhoneOTPStrategy(cognitoClient);
        ReflectionTestUtils.setField(phoneOtpStrategy, "userPoolId", "test-pool-id");
        ReflectionTestUtils.setField(phoneOtpStrategy, "clientId", "test-client-id");
        ReflectionTestUtils.setField(phoneOtpStrategy, "clientSecret", "test-client-secret");
    }

    @Test
    void sendOtp_ForNewUser_ShouldCreateUserAndSendOtp() {
        // Arrange
        SendOTPRequest request = new SendOTPRequest();
        request.setValue("+1234567890");
        String username = "+1234567890";
        String session = "test-session";

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenThrow(new UserNotFoundException("User not found"));
        when(cognitoClient.listUsers(any(ListUsersRequest.class)))
                .thenReturn(new ListUsersResult().withUsers(new ArrayList<>())); // Initialize empty list
        when(cognitoClient.adminInitiateAuth(any(AdminInitiateAuthRequest.class)))
                .thenReturn(new AdminInitiateAuthResult().withSession(session));

        // Act
        SendOTPResponse response = phoneOtpStrategy.sendOtp(request);

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
        request.setValue("+1234567890");
        String username = "existinguser";
        String session = "test-session";

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(new AdminGetUserResult().withUserAttributes(new ArrayList<>()));
        when(cognitoClient.adminInitiateAuth(any(AdminInitiateAuthRequest.class)))
                .thenReturn(new AdminInitiateAuthResult().withSession(session));

        // Act
        SendOTPResponse response = phoneOtpStrategy.sendOtp(request);

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
        request.setValue("+1234567890");

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenThrow(new RuntimeException("Cognito error"));

        // Act & Assert
        assertThrows(OtpSendFailedException.class, () -> phoneOtpStrategy.sendOtp(request));
    }

    @Test
    void verifyOtp_WithValidOtp_ShouldReturnTokens() {
        // Arrange
        VerifyOTPRequest request = new VerifyOTPRequest();
        request.setValue("+1234567890");
        request.setOtp("123456");
        request.setSession("test-session");
        String username = "testuser";
        String idToken = "test-id-token";
        String accessToken = "test-access-token";

        List<AttributeType> userAttributes = new ArrayList<>();
        userAttributes.add(new AttributeType().withName("phone_number_verified").withValue("true"));

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(new AdminGetUserResult().withUserAttributes(userAttributes));
        when(cognitoClient.adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class)))
                .thenReturn(new AdminRespondToAuthChallengeResult()
                        .withAuthenticationResult(new AuthenticationResultType()
                                .withIdToken(idToken)
                                .withAccessToken(accessToken)));

        // Act
        VerifyOTPResponse response = phoneOtpStrategy.verifyOtp(request);

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
        request.setValue("+1234567890");
        request.setOtp("123456");
        request.setSession("test-session");
        String newSession = "new-session";

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(new AdminGetUserResult().withUserAttributes(new ArrayList<>()));
        when(cognitoClient.adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class)))
                .thenReturn(new AdminRespondToAuthChallengeResult()
                        .withSession(newSession));

        // Act
        VerifyOTPResponse response = phoneOtpStrategy.verifyOtp(request);

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
        request.setValue("+1234567890");
        request.setOtp("123456");
        request.setSession("test-session");

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(new AdminGetUserResult().withUserAttributes(new ArrayList<>()));
        when(cognitoClient.adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class)))
                .thenThrow(new NotAuthorizedException("Invalid credentials"));

        // Act
        VerifyOTPResponse response = phoneOtpStrategy.verifyOtp(request);

        // Assert
        assertNotNull(response);
        assertTrue(response.getMessage().contains("Authentication failed"));
        verify(cognitoClient).adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class));
    }

    @Test
    void verifyOtp_WhenUserNotFound_ShouldReturnErrorMessage() {
        // Arrange
        VerifyOTPRequest request = new VerifyOTPRequest();
        request.setValue("+1234567890");
        request.setOtp("123456");
        request.setSession("test-session");

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenThrow(new UserNotFoundException("User not found"));
        when(cognitoClient.listUsers(any(ListUsersRequest.class)))
                .thenReturn(new ListUsersResult().withUsers(new ArrayList<>()));

        // Act
        VerifyOTPResponse response = phoneOtpStrategy.verifyOtp(request);

        // Assert
        assertNotNull(response);
        assertTrue(response.getMessage().contains("User not found after OTP send"));
        verify(cognitoClient, never()).adminRespondToAuthChallenge(any(AdminRespondToAuthChallengeRequest.class));
    }
} 