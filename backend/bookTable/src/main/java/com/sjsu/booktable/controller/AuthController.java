package com.sjsu.booktable.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello BookTable";
    }

    @GetMapping("/hello2")
    public String hello2() {
        return "Hello BookTable 2";
    }
}
