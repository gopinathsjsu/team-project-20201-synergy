package com.sjsu.booktable.model.dto.auth;

import lombok.Data;

@Data
public class VerifyOTPResponse {

    private String idToken;
    private String accessToken;
    private boolean requiresRegistration;
    private String session;
    private String message;

}
