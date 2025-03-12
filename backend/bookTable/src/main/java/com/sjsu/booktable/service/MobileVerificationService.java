package com.sjsu.booktable.service;

import com.sjsu.booktable.model.entity.User;
import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class MobileVerificationService implements VerificationService {

    @Value("${twilio.account_sid}")
    private String accountSid;

    @Value("${twilio.auth_token}")
    private String authToken;

    @Value("${twilio.verify_sid}")
    private String verifySid;

    @Override
    public Object initiateUserVerification(User user) {
        Twilio.init(accountSid, authToken);
        Verification verification = Verification.creator(verifySid, user.getPhoneNumber(), Verification.Channel.SMS.toString()).create();
        return verification;
    }

    @Override
    public Object verifyUser(User user) {
        VerificationCheck verificationCheck = VerificationCheck.creator(verifySid)
                .setTo(user.getPhoneNumber())
                .setCode("otp")
                .create();

        return verificationCheck;
    }
}
