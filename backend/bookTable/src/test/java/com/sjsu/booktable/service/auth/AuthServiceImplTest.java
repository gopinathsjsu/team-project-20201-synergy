package com.sjsu.booktable.service.auth;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.GlobalSignOutRequest;
import com.amazonaws.services.cognitoidp.model.GlobalSignOutResult;
import com.sjsu.booktable.exception.auth.InvalidRequestException;
import com.sjsu.booktable.exception.auth.LogoutFailedException;
import com.sjsu.booktable.model.dto.auth.SendOTPRequest;
import com.sjsu.booktable.model.dto.auth.SendOTPResponse;
import com.sjsu.booktable.model.dto.auth.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.auth.VerifyOTPResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AWSCognitoIdentityProvider cognitoClient;

    @Mock
    private PhoneOTPStrategy phoneOtpStrategy;

    @Mock
    private EmailOTPStrategy emailOtpStrategy;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(cognitoClient, phoneOtpStrategy, emailOtpStrategy);
    }

    @Test
    void sendOtp_WithPhoneIdentifier_ShouldUsePhoneStrategy() {
        // Arrange
        SendOTPRequest request = new SendOTPRequest();
        request.setIdentifier("phone");
        SendOTPResponse expectedResponse = new SendOTPResponse();
        when(phoneOtpStrategy.sendOtp(request)).thenReturn(expectedResponse);

        // Act
        SendOTPResponse response = authService.sendOtp(request);

        // Assert
        assertEquals(expectedResponse, response);
        verify(phoneOtpStrategy).sendOtp(request);
        verify(emailOtpStrategy, never()).sendOtp(any());
    }

    @Test
    void sendOtp_WithEmailIdentifier_ShouldUseEmailStrategy() {
        // Arrange
        SendOTPRequest request = new SendOTPRequest();
        request.setIdentifier("email");
        SendOTPResponse expectedResponse = new SendOTPResponse();
        when(emailOtpStrategy.sendOtp(request)).thenReturn(expectedResponse);

        // Act
        SendOTPResponse response = authService.sendOtp(request);

        // Assert
        assertEquals(expectedResponse, response);
        verify(emailOtpStrategy).sendOtp(request);
        verify(phoneOtpStrategy, never()).sendOtp(any());
    }

    @Test
    void verifyOtp_WithPhoneIdentifier_ShouldUsePhoneStrategy() {
        // Arrange
        VerifyOTPRequest request = new VerifyOTPRequest();
        request.setIdentifier("phone");
        VerifyOTPResponse expectedResponse = new VerifyOTPResponse();
        when(phoneOtpStrategy.verifyOtp(request)).thenReturn(expectedResponse);

        // Act
        VerifyOTPResponse response = authService.verifyOtp(request);

        // Assert
        assertEquals(expectedResponse, response);
        verify(phoneOtpStrategy).verifyOtp(request);
        verify(emailOtpStrategy, never()).verifyOtp(any());
    }

    @Test
    void verifyOtp_WithEmailIdentifier_ShouldUseEmailStrategy() {
        // Arrange
        VerifyOTPRequest request = new VerifyOTPRequest();
        request.setIdentifier("email");
        VerifyOTPResponse expectedResponse = new VerifyOTPResponse();
        when(emailOtpStrategy.verifyOtp(request)).thenReturn(expectedResponse);

        // Act
        VerifyOTPResponse response = authService.verifyOtp(request);

        // Assert
        assertEquals(expectedResponse, response);
        verify(emailOtpStrategy).verifyOtp(request);
        verify(phoneOtpStrategy, never()).verifyOtp(any());
    }

    @Test
    void logout_WithValidToken_ShouldSucceed() {
        // Arrange
        String validToken = "valid-token";
        when(cognitoClient.globalSignOut(any(GlobalSignOutRequest.class)))
                .thenReturn(new GlobalSignOutResult());

        // Act & Assert
        assertDoesNotThrow(() -> authService.logout(validToken));
        verify(cognitoClient).globalSignOut(any(GlobalSignOutRequest.class));
    }

    @Test
    void logout_WithNullToken_ShouldThrowInvalidRequestException() {
        // Act & Assert
        assertThrows(InvalidRequestException.class, () -> authService.logout(null));
        verify(cognitoClient, never()).globalSignOut(any(GlobalSignOutRequest.class));
    }

    @Test
    void logout_WithEmptyToken_ShouldThrowInvalidRequestException() {
        // Act & Assert
        assertThrows(InvalidRequestException.class, () -> authService.logout(""));
        verify(cognitoClient, never()).globalSignOut(any(GlobalSignOutRequest.class));
    }

    @Test
    void logout_WhenCognitoFails_ShouldThrowLogoutFailedException() {
        // Arrange
        String validToken = "valid-token";
        when(cognitoClient.globalSignOut(any(GlobalSignOutRequest.class)))
                .thenThrow(new RuntimeException("Cognito error"));

        // Act & Assert
        assertThrows(LogoutFailedException.class, () -> authService.logout(validToken));
        verify(cognitoClient).globalSignOut(any(GlobalSignOutRequest.class));
    }
} 