package com.sjsu.booktable.service.auth;

import com.sjsu.booktable.model.dto.auth.SendOTPRequest;
import com.sjsu.booktable.model.dto.auth.SendOTPResponse;
import com.sjsu.booktable.model.dto.auth.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.auth.VerifyOTPResponse;

public interface OTPStrategy {
    SendOTPResponse sendOtp(SendOTPRequest request);
    VerifyOTPResponse verifyOtp(VerifyOTPRequest request);
}
