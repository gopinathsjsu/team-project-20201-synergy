package com.sjsu.authservice.service;

import com.sjsu.authservice.model.User;

public interface VerificationService {

    public Object initiateUserVerification(User user);

    public Object verifyUser(User user);
}
