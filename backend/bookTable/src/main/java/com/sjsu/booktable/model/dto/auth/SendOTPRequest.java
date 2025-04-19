package com.sjsu.booktable.model.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendOTPRequest {

    @NotBlank
    private String identifier;

    @NotBlank
    private String value;
}
