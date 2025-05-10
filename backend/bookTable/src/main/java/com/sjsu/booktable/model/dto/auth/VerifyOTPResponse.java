package com.sjsu.booktable.model.dto.auth;

import com.sjsu.booktable.model.enums.Role;
import lombok.Data;

@Data
public class VerifyOTPResponse {

    private String idToken;
    private String accessToken;
    private boolean requiresRegistration;
    private String session;
    private String message;
    private Role userRole;

}
