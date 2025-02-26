package com.sjsu.authservice.controller;

import com.sjsu.authservice.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        userService.registerUser(user);
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user in database
        userRepository.save(user);

        return "User registered successfully!";
    }
}
