package com.sjsu.booktable.service.user;

import com.sjsu.booktable.model.dto.user.RegistrationRequest;
import com.sjsu.booktable.model.dto.user.RegistrationResponse;
import com.sjsu.booktable.model.entity.User;

public interface UserService {

    RegistrationResponse registerUser(String cognitoUserId, RegistrationRequest request);

    User getUserDetails(String userId);
}
