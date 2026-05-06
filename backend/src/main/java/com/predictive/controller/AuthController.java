package com.predictive.controller;

import com.predictive.dto.AuthDtos.AuthResponse;
import com.predictive.dto.AuthDtos.LoginRequest;
import com.predictive.dto.AuthDtos.MessageResponse;
import com.predictive.dto.AuthDtos.RegisterRequest;
import com.predictive.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword() {
        return ResponseEntity.ok(new MessageResponse("Password reset email is not configured for this demo."));
    }
}
