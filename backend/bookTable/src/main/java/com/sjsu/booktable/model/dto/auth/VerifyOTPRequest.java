package com.sjsu.booktable.model.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyOTPRequest {

    @NotBlank
    private String identifier;

    @NotBlank
    private String value;

    @NotBlank
    private String otp;

    @NotBlank
    private String session;
}
