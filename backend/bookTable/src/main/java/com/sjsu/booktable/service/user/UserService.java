package com.sjsu.booktable.service.user;

import com.sjsu.booktable.model.dto.user.RegistrationRequest;

public interface UserService {

    RegistrationResponse registerUser(String cognitoUserId, RegistrationRequest req);
}
