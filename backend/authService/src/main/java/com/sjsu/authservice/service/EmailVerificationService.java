package com.sjsu.authservice.service;

import com.sjsu.authservice.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailVerificationService implements VerificationService {

    @Override
    public Object initiateUserVerification(User user) {
        return null;
    }

    @Override
    public Object verifyUser(User user) {
        return null;
    }
}
