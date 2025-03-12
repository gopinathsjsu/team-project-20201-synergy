package com.sjsu.booktable.service;

import com.sjsu.booktable.model.entity.User;

public interface VerificationService {

    public Object initiateUserVerification(User user);

    public Object verifyUser(User user);
}
