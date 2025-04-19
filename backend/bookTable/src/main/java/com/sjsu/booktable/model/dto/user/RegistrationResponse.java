package com.sjsu.booktable.model.dto.user;

import lombok.Data;

@Data
public class RegistrationResponse {

    private String userId;
    private String firstName;
    private String lastName;
}
