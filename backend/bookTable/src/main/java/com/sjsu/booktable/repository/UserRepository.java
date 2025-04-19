package com.sjsu.booktable.repository;

import com.sjsu.booktable.model.dto.user.RegistrationRequest;
import com.sjsu.booktable.model.entity.User;

public interface UserRepository {

    void save(String useId, RegistrationRequest request);

    User findById(String userId);
}
