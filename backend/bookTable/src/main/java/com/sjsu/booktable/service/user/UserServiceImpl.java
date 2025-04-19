package com.sjsu.booktable.service.user;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import com.sjsu.booktable.exception.auth.AuthException;
import com.sjsu.booktable.exception.auth.RegistrationFailedException;
import com.sjsu.booktable.model.dto.user.RegistrationRequest;
import com.sjsu.booktable.model.dto.user.RegistrationResponse;
import com.sjsu.booktable.model.entity.User;
import com.sjsu.booktable.repository.UserRepository;
import com.sjsu.booktable.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    protected final AWSCognitoIdentityProvider cognitoClient;
    private final UserRepository userRepository;

    @Value("${cognito.userPoolId}") protected String userPoolId;

    @Override
    public RegistrationResponse registerUser(String cognitoUserId, RegistrationRequest request) {
        try {
            // 1) fetch current user attributes to see how they authenticated
            AdminGetUserResult user = cognitoClient.adminGetUser(new AdminGetUserRequest()
                    .withUserPoolId(userPoolId)
                    .withUsername(cognitoUserId)
            );

            // look for our custom marker (set during OTP send)
            String loginMethod = user.getUserAttributes().stream()
                    .filter(a -> a.getName().equals("custom:login_method"))
                    .findFirst()
                    .map(AttributeType::getValue)
                    .orElseThrow(() -> new RegistrationFailedException("Missing login method"));

            // 2) enforce that they provide the other channel
            if ("email".equals(loginMethod)) {
                user.getUserAttributes().stream()
                        .filter(a -> a.getName().equals("email"))
                        .findFirst()
                        .ifPresent(a -> request.setEmail(a.getValue()));
                if(StringUtils.isBlank(request.getPhoneNumber())) {
                    throw new RegistrationFailedException("Phone number is required when you first signed in with email");
                }
            }

            if ("phone".equals(loginMethod)) {
                user.getUserAttributes().stream()
                        .filter(a -> a.getName().equals("phone_number"))
                        .findFirst()
                        .ifPresent(a -> request.setPhoneNumber(a.getValue()));
                if(StringUtils.isBlank(request.getEmail())) {
                    throw new RegistrationFailedException("Email is required when you first signed in with phone number");
                }
            }

            // 3) update whichever attribute was missing
            List<AttributeType> updates = new ArrayList<>();
            updates.add(new AttributeType().withName("given_name").withValue(request.getFirstName()));
            updates.add(new AttributeType().withName("family_name").withValue(request.getLastName()));
            updates.add(new AttributeType().withName("custom:registered").withValue("true"));

            if (!StringUtils.isBlank(request.getEmail())) {
                updates.add(new AttributeType().withName("email").withValue(request.getEmail()));
                updates.add(new AttributeType().withName("email_verified").withValue("true"));
            }

            if (!StringUtils.isBlank(request.getPhoneNumber())) {
                updates.add(new AttributeType().withName("phone_number").withValue(request.getPhoneNumber()));
                updates.add(new AttributeType().withName("phone_number_verified").withValue("true"));
            }

            cognitoClient.adminUpdateUserAttributes(new AdminUpdateUserAttributesRequest()
                    .withUserPoolId(userPoolId)
                    .withUsername(cognitoUserId)
                    .withUserAttributes(updates)
            );

            // 4) add them to their Cognito group
            cognitoClient.adminAddUserToGroup(new AdminAddUserToGroupRequest()
                    .withUserPoolId(userPoolId)
                    .withUsername(cognitoUserId)
                    .withGroupName(request.getRole().getName())
            );

            userRepository.save(cognitoUserId, request);

            RegistrationResponse registrationResponse = new RegistrationResponse();
            registrationResponse.setUserId(cognitoUserId);
            registrationResponse.setFirstName(request.getFirstName());
            registrationResponse.setLastName(request.getLastName());
            return registrationResponse;
        } catch (Exception e) {
            log.error("Error registering user: ", e);
            throw new RegistrationFailedException(e.getMessage());
        }
    }

    @Override
    public User getUserDetails(String userId) {
        User user = userRepository.findById(userId);

        if (user == null) {
            throw new AuthException("User not found", HttpStatus.NOT_FOUND);
        }

        return user;
    }

}
