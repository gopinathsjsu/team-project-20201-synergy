package com.sjsu.booktable.service.auth;

import com.sjsu.booktable.model.dto.auth.*;
import org.springframework.security.core.Authentication;

public interface AuthService {

    SendOTPResponse sendOtp(SendOTPRequest request);

    VerifyOTPResponse verifyOtp(VerifyOTPRequest request);

    AuthStatusResponse getLoginStatus(Authentication authentication);

    void logout(String token);
}
