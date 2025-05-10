package com.sjsu.booktable.model.dto.auth;

import com.sjsu.booktable.model.enums.Role;
import lombok.Data;

@Data
public class AuthStatusResponse {

    private boolean loggedIn;
    private Role userRole;
}
