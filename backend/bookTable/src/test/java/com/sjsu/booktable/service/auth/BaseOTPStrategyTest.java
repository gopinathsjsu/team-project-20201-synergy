package com.sjsu.booktable.service.auth;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
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

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BaseOTPStrategyTest {

    @Mock
    private AWSCognitoIdentityProvider cognitoClient;

    private TestOTPStrategy testStrategy;

    private static class TestOTPStrategy extends BaseOTPStrategy {
        public TestOTPStrategy(AWSCognitoIdentityProvider cognitoClient) {
            super(cognitoClient);
        }

        @Override
        public SendOTPResponse sendOtp(SendOTPRequest request) {
            return null;
        }

        @Override
        public VerifyOTPResponse verifyOtp(VerifyOTPRequest request) {
            return null;
        }
    }

    @BeforeEach
    void setUp() {
        testStrategy = new TestOTPStrategy(cognitoClient);
        ReflectionTestUtils.setField(testStrategy, "userPoolId", "test-pool-id");
        ReflectionTestUtils.setField(testStrategy, "clientId", "test-client-id");
        ReflectionTestUtils.setField(testStrategy, "clientSecret", "test-client-secret");
    }

    @Test
    void resolveUsername_WhenUserExists_ShouldReturnUsername() {
        // Arrange
        String username = "testuser";
        String attributeName = "email";
        AdminGetUserResult userResult = new AdminGetUserResult();
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(userResult);

        // Act
        String result = testStrategy.resolveUsername(username, attributeName);

        // Assert
        assertEquals(username, result);
        verify(cognitoClient).adminGetUser(any(AdminGetUserRequest.class));
        verify(cognitoClient, never()).listUsers(any(ListUsersRequest.class));
    }

    @Test
    void resolveUsername_WhenUserNotFound_ShouldSearchByAttribute() {
        // Arrange
        String email = "test@example.com";
        String attributeName = "email";
        String foundUsername = "founduser";
        UserType user = new UserType().withUsername(foundUsername);
        ListUsersResult listResult = new ListUsersResult().withUsers(user);
        
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenThrow(new UserNotFoundException("User not found"));
        when(cognitoClient.listUsers(any(ListUsersRequest.class)))
                .thenReturn(listResult);

        // Act
        String result = testStrategy.resolveUsername(email, attributeName);

        // Assert
        assertEquals(foundUsername, result);
        verify(cognitoClient).adminGetUser(any(AdminGetUserRequest.class));
        verify(cognitoClient).listUsers(any(ListUsersRequest.class));
    }

    @Test
    void resolveUsername_WhenUserNotFoundAndNoAttributeMatch_ShouldReturnNull() {
        // Arrange
        String email = "test@example.com";
        String attributeName = "email";
        ListUsersResult listResult = new ListUsersResult().withUsers(Collections.emptyList());
        
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenThrow(new UserNotFoundException("User not found"));
        when(cognitoClient.listUsers(any(ListUsersRequest.class)))
                .thenReturn(listResult);

        // Act
        String result = testStrategy.resolveUsername(email, attributeName);

        // Assert
        assertNull(result);
        verify(cognitoClient).adminGetUser(any(AdminGetUserRequest.class));
        verify(cognitoClient).listUsers(any(ListUsersRequest.class));
    }

    @Test
    void checkRegistrationStatus_WhenUserIsNotRegistered_ShouldReturnTrue() {
        // Arrange
        String username = "testuser";
        AdminGetUserResult userResult = new AdminGetUserResult()
                .withUserAttributes(new AttributeType()
                        .withName("custom:registered")
                        .withValue("false"));
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(userResult);

        // Act
        boolean result = testStrategy.checkRegistrationStatus(username);

        // Assert
        assertTrue(result);
        verify(cognitoClient).adminGetUser(any(AdminGetUserRequest.class));
    }

    @Test
    void checkRegistrationStatus_WhenUserIsRegistered_ShouldReturnFalse() {
        // Arrange
        String username = "testuser";
        AdminGetUserResult userResult = new AdminGetUserResult()
                .withUserAttributes(new AttributeType()
                        .withName("custom:registered")
                        .withValue("true"));
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class)))
                .thenReturn(userResult);

        // Act
        boolean result = testStrategy.checkRegistrationStatus(username);

        // Assert
        assertFalse(result);
        verify(cognitoClient).adminGetUser(any(AdminGetUserRequest.class));
    }

    @Test
    void calculateSecretHash_ShouldReturnValidHash() {
        // Arrange
        String username = "testuser";

        // Act
        String result = testStrategy.calculateSecretHash(username);

        // Assert
        assertNotNull(result);
        assertTrue(result.length() > 0);
    }
} 