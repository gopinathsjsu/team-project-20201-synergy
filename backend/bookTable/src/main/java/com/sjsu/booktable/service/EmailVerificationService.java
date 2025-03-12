package com.sjsu.booktable.service;

import com.sjsu.booktable.model.entity.User;
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
