package com.predictive.service;

import com.predictive.dto.AuthDtos.AuthResponse;
import com.predictive.dto.AuthDtos.LoginRequest;
import com.predictive.dto.AuthDtos.RegisterRequest;
import com.predictive.dto.AuthDtos.UserResponse;
import com.predictive.entity.AppUser;
import com.predictive.repository.AppUserRepository;
import com.predictive.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        AppUser user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return responseFor(user);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }

        AppUser user = new AppUser();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(parseRole(request.role()));

        return responseFor(userRepository.save(user));
    }

    private AuthResponse responseFor(AppUser user) {
        return new AuthResponse(
                jwtService.generateToken(user),
                new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getRole().name())
        );
    }

    private AppUser.Role parseRole(String role) {
        if ("ADMIN".equalsIgnoreCase(role)) {
            return AppUser.Role.ADMIN;
        }
        return AppUser.Role.USER;
    }
}
