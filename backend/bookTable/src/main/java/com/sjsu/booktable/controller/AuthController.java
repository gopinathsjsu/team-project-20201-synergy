package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.SendOTPRequest;
import com.sjsu.booktable.model.dto.VerifyOTPRequest;
import com.sjsu.booktable.model.dto.VerifyOTPResponse;
import com.sjsu.booktable.service.auth.AuthService;
import com.sjsu.booktable.utils.StringUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/otp/send")
    public ResponseEntity sendOtp(@RequestBody @Valid SendOTPRequest request) {
        return ResponseEntity.ok(BTResponse.success(authService.sendOtp(request)));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity verifyOtp(@RequestBody @Valid VerifyOTPRequest request, HttpServletResponse response) {
        VerifyOTPResponse verifyResponse = authService.verifyOtp(request);

        if(!StringUtils.isBlank(verifyResponse.getAccessToken())) {
            // Set access token in HTTP-only cookie
            Cookie tokenCookie = new Cookie("api-token", verifyResponse.getAccessToken());
            tokenCookie.setHttpOnly(true);
            tokenCookie.setSecure(true);
            tokenCookie.setPath("/"); // Cookie available for all routes
            tokenCookie.setMaxAge(10800); // Match token expiry, e.g., 3 hour
            response.addCookie(tokenCookie);
        }

        return ResponseEntity.ok(BTResponse.success(verifyResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity logout(@CookieValue(value = "api-token", required = false) String token, HttpServletResponse response) {
        authService.logout(token);

        // Clear the cookie on logout
        Cookie clearCookie = new Cookie("api-token", null);
        clearCookie.setHttpOnly(true);
        clearCookie.setSecure(true);
        clearCookie.setPath("/");
        clearCookie.setMaxAge(0); // Delete cookie
        response.addCookie(clearCookie);

        return ResponseEntity.ok(BTResponse.success("Logged out successfully"));
    }

}
