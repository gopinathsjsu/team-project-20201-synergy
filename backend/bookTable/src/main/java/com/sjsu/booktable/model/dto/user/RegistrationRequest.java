package com.sjsu.booktable.model.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegistrationRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String role;

    private String email;

    private String phoneNumber;

}
