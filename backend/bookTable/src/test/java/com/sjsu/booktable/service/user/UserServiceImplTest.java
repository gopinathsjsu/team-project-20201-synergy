package com.sjsu.booktable.service.user;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.*;
import com.sjsu.booktable.exception.auth.AuthException;
import com.sjsu.booktable.exception.auth.RegistrationFailedException;
import com.sjsu.booktable.model.dto.user.RegistrationRequest;
import com.sjsu.booktable.model.dto.user.RegistrationResponse;
import com.sjsu.booktable.model.entity.User;
import com.sjsu.booktable.model.enums.Role;
import com.sjsu.booktable.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private AWSCognitoIdentityProvider cognitoClient;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private static final String USER_POOL_ID = "test-pool-id";
    private static final String COGNITO_USER_ID = "test-user-id";
    private RegistrationRequest registrationRequest;
    private AdminGetUserResult cognitoUser;
    private List<AttributeType> userAttributes;

    @BeforeEach
    void setUp() {
        // Setup registration request
        registrationRequest = new RegistrationRequest();
        registrationRequest.setFirstName("John");
        registrationRequest.setLastName("Doe");
        registrationRequest.setEmail("john.doe@example.com");
        registrationRequest.setPhoneNumber("+1234567890");
        registrationRequest.setRole(Role.CUSTOMER);

        // Setup Cognito user attributes
        userAttributes = new ArrayList<>();
        userAttributes.add(new AttributeType().withName("custom:login_method").withValue("email"));
        userAttributes.add(new AttributeType().withName("email").withValue("john.doe@example.com"));

        cognitoUser = new AdminGetUserResult();
        cognitoUser.setUserAttributes(userAttributes);

        // Set user pool ID
        userService.userPoolId = USER_POOL_ID;
    }

    @Test
    void registerUser_EmailLogin_Success() {
        // Arrange
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class))).thenReturn(cognitoUser);
        when(cognitoClient.adminUpdateUserAttributes(any(AdminUpdateUserAttributesRequest.class)))
                .thenReturn(new AdminUpdateUserAttributesResult());
        when(cognitoClient.adminAddUserToGroup(any(AdminAddUserToGroupRequest.class)))
                .thenReturn(new AdminAddUserToGroupResult());
        doNothing().when(userRepository).save(anyString(), any(RegistrationRequest.class));

        // Act
        RegistrationResponse response = userService.registerUser(COGNITO_USER_ID, registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals(COGNITO_USER_ID, response.getUserId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());

        // Verify interactions
        verify(cognitoClient).adminGetUser(any(AdminGetUserRequest.class));
        verify(cognitoClient).adminUpdateUserAttributes(any(AdminUpdateUserAttributesRequest.class));
        verify(cognitoClient).adminAddUserToGroup(any(AdminAddUserToGroupRequest.class));
        verify(userRepository).save(anyString(), any(RegistrationRequest.class));
    }

    @Test
    void registerUser_PhoneLogin_Success() {
        // Arrange
        userAttributes.clear();
        userAttributes.add(new AttributeType().withName("custom:login_method").withValue("phone"));
        userAttributes.add(new AttributeType().withName("phone_number").withValue("+1234567890"));

        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class))).thenReturn(cognitoUser);
        when(cognitoClient.adminUpdateUserAttributes(any(AdminUpdateUserAttributesRequest.class)))
                .thenReturn(new AdminUpdateUserAttributesResult());
        when(cognitoClient.adminAddUserToGroup(any(AdminAddUserToGroupRequest.class)))
                .thenReturn(new AdminAddUserToGroupResult());
        doNothing().when(userRepository).save(anyString(), any(RegistrationRequest.class));

        // Act
        RegistrationResponse response = userService.registerUser(COGNITO_USER_ID, registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals(COGNITO_USER_ID, response.getUserId());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());

        // Verify interactions
        verify(cognitoClient).adminGetUser(any(AdminGetUserRequest.class));
        verify(cognitoClient).adminUpdateUserAttributes(any(AdminUpdateUserAttributesRequest.class));
        verify(cognitoClient).adminAddUserToGroup(any(AdminAddUserToGroupRequest.class));
        verify(userRepository).save(anyString(), any(RegistrationRequest.class));
    }

    @Test
    void registerUser_EmailLogin_MissingPhoneNumber() {
        // Arrange
        registrationRequest.setPhoneNumber(null);
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class))).thenReturn(cognitoUser);

        // Act & Assert
        RegistrationFailedException exception = assertThrows(RegistrationFailedException.class,
                () -> userService.registerUser(COGNITO_USER_ID, registrationRequest));
        assertTrue(exception.getMessage().contains("Phone number is required when you first signed in with email"));
    }

    @Test
    void registerUser_PhoneLogin_MissingEmail() {
        // Arrange
        userAttributes.clear();
        userAttributes.add(new AttributeType().withName("custom:login_method").withValue("phone"));
        userAttributes.add(new AttributeType().withName("phone_number").withValue("+1234567890"));
        cognitoUser.setUserAttributes(userAttributes);
        registrationRequest.setEmail(null);
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class))).thenReturn(cognitoUser);

        // Act & Assert
        RegistrationFailedException exception = assertThrows(RegistrationFailedException.class,
                () -> userService.registerUser(COGNITO_USER_ID, registrationRequest));
        assertTrue(exception.getMessage().contains("Email is required when you first signed in with phone number"));
    }

    @Test
    void registerUser_MissingLoginMethod() {
        // Arrange
        userAttributes.clear();
        userAttributes.add(new AttributeType().withName("email").withValue("john.doe@example.com"));
        cognitoUser.setUserAttributes(userAttributes);
        when(cognitoClient.adminGetUser(any(AdminGetUserRequest.class))).thenReturn(cognitoUser);

        // Act & Assert
        RegistrationFailedException exception = assertThrows(RegistrationFailedException.class,
                () -> userService.registerUser(COGNITO_USER_ID, registrationRequest));
        assertTrue(exception.getMessage().contains("Missing login method"));
    }

    @Test
    void getUserDetails_Success() {
        // Arrange
        User expectedUser = User.builder()
                .userId(COGNITO_USER_ID)
                .firstName("John")
                .lastName("Doe")
                .build();

        when(userRepository.findById(COGNITO_USER_ID)).thenReturn(expectedUser);

        // Act
        User result = userService.getUserDetails(COGNITO_USER_ID);

        // Assert
        assertNotNull(result);
        assertEquals(COGNITO_USER_ID, result.getUserId());
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());
    }

    @Test
    void getUserDetails_UserNotFound() {
        // Arrange
        when(userRepository.findById(COGNITO_USER_ID)).thenReturn(null);

        // Act & Assert
        AuthException exception = assertThrows(AuthException.class,
                () -> userService.getUserDetails(COGNITO_USER_ID));
        assertEquals("User not found", exception.getMessage());
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
    }
} 