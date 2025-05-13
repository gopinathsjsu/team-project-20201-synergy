package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.auth.SendOTPRequest;
import com.sjsu.booktable.model.dto.auth.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.auth.VerifyOTPResponse;
import com.sjsu.booktable.model.dto.user.RegistrationRequest;
import com.sjsu.booktable.model.dto.user.RegistrationResponse;
import com.sjsu.booktable.model.entity.User;
import com.sjsu.booktable.service.auth.AuthService;
import com.sjsu.booktable.service.user.UserService;
import com.sjsu.booktable.utils.StringUtils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/otp/send")
    public ResponseEntity sendOtp(@RequestBody @Valid SendOTPRequest request) {
        return ResponseEntity.ok(BTResponse.success(authService.sendOtp(request)));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity verifyOtp(@RequestBody @Valid VerifyOTPRequest request, HttpServletResponse response) {
        VerifyOTPResponse verifyResponse = authService.verifyOtp(request);

        if(!StringUtils.isBlank(verifyResponse.getAccessToken())) {
            // Set access token in HTTP-only cookie
            ResponseCookie tokenCookie = ResponseCookie.from("api-token", verifyResponse.getAccessToken())
                    .httpOnly(true)
                    .path("/") // Cookie available for all routes
                    .maxAge(10800) // Match token expiry, e.g., 3 hour
                    .secure(true)
                    .sameSite("None")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, tokenCookie.toString());
        }
        return ResponseEntity.ok(BTResponse.success(verifyResponse));
    }

    @GetMapping("/status")
    public ResponseEntity getLoginStatus(Authentication authentication) {
        return ResponseEntity.ok(BTResponse.success(authService.getLoginStatus(authentication)));
    }

    @PostMapping("/logout")
    public ResponseEntity logout(@CookieValue(value = "api-token", required = false) String token, HttpServletResponse response) {
        authService.logout(token);

        // Clear the cookie on logout
        ResponseCookie clearCookie = ResponseCookie.from("api-token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0) // Delete cookie
                .secure(true)
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());
        return ResponseEntity.ok(BTResponse.success("Logged out successfully"));
    }

    @PostMapping("/register")
    public ResponseEntity registerUser(@RequestBody @Valid RegistrationRequest request, @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        RegistrationResponse response = userService.registerUser(userId, request);
        return ResponseEntity.ok(BTResponse.success(response));
    }

    @GetMapping("/profile")
    public ResponseEntity getProfile(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        User user = userService.getUserDetails(userId);
        return ResponseEntity.ok(BTResponse.success(user));
    }

}
