package com.predictive.dto;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record LoginRequest(String email, String password) {
    }

    public record RegisterRequest(String fullName, String email, String phone, String password, String role) {
    }

    public record UserResponse(Long id, String fullName, String email, String phone, String role) {
    }

    public record AuthResponse(String token, UserResponse user) {
    }

    public record MessageResponse(String message) {
    }
}
