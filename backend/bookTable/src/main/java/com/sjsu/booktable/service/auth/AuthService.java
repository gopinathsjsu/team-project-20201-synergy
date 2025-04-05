package com.sjsu.booktable.service.auth;

import com.sjsu.booktable.model.dto.SendOTPRequest;
import com.sjsu.booktable.model.dto.SendOTPResponse;
import com.sjsu.booktable.model.dto.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.VerifyOTPResponse;

public interface AuthService {

    SendOTPResponse sendOtp(SendOTPRequest request);

    VerifyOTPResponse verifyOtp(VerifyOTPRequest request);

    void logout(String token);
}
