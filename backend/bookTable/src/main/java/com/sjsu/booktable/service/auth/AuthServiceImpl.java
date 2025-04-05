package com.sjsu.booktable.service.auth;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import com.sjsu.booktable.exception.auth.InvalidRequestException;
import com.sjsu.booktable.exception.auth.LogoutFailedException;
import com.sjsu.booktable.model.dto.SendOTPRequest;
import com.sjsu.booktable.model.dto.SendOTPResponse;
import com.sjsu.booktable.model.dto.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.VerifyOTPResponse;
import com.sjsu.booktable.model.enums.OTPIdentifier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final AWSCognitoIdentityProvider cognitoClient;
    private final Map<OTPIdentifier, OTPStrategy> otpStrategies;

    @Autowired
    public AuthServiceImpl(AWSCognitoIdentityProvider cognitoClient,
                           PhoneOTPStrategy phoneOtpStrategy,
                           EmailOTPStrategy emailOtpStrategy) {
        this.cognitoClient = cognitoClient;
        this.otpStrategies = Map.of(
                OTPIdentifier.PHONE, phoneOtpStrategy,
                OTPIdentifier.EMAIL, emailOtpStrategy
        );
    }

    @Override
    public SendOTPResponse sendOtp(SendOTPRequest request) {
        OTPIdentifier type = OTPIdentifier.fromValue(request.getIdentifier());
        OTPStrategy strategy = otpStrategies.get(type);
        return strategy.sendOtp(request);
    }

    @Override
    public VerifyOTPResponse verifyOtp(VerifyOTPRequest request) {
        OTPIdentifier type = OTPIdentifier.fromValue(request.getIdentifier());
        OTPStrategy strategy = otpStrategies.get(type);
        return strategy.verifyOtp(request);
    }

    @Override
    public void logout(String accessToken) {
        if (accessToken == null || accessToken.trim().isEmpty()) {
            throw new InvalidRequestException("Invalid or missing api-token header");
        }

        try {
            GlobalSignOutRequest signOutRequest = new GlobalSignOutRequest()
                    .withAccessToken(accessToken);
            cognitoClient.globalSignOut(signOutRequest);
        } catch (Exception e) {
            throw new LogoutFailedException(e.getMessage());
        }
    }
}
