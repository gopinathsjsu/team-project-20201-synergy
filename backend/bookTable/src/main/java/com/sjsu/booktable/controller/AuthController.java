package com.sjsu.booktable.controller;

import com.sjsu.booktable.model.dto.BTResponse;
import com.sjsu.booktable.model.dto.SendOTPRequest;
import com.sjsu.booktable.model.dto.VerifyOTPRequest;
import com.sjsu.booktable.service.auth.AuthService;
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
    public ResponseEntity verifyOtp(@RequestBody @Valid VerifyOTPRequest request) {
        return ResponseEntity.ok(BTResponse.success(authService.verifyOtp(request)));
    }

    @PostMapping("/logout")
    public ResponseEntity logout(@RequestHeader(value = "api-token", required = false) String token) {
        authService.logout(token);
        return ResponseEntity.ok(BTResponse.success("Logged out successfully"));
    }

}
