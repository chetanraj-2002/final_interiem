package com.predictive.config;

import com.predictive.entity.AppUser;
import com.predictive.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DefaultUserSeeder {

    @Bean
    CommandLineRunner seedDefaultUsers(AppUserRepository users, PasswordEncoder passwordEncoder) {
        return args -> {
            createIfMissing(users, passwordEncoder, "Admin User", "admin@pm.local", "+91 90000 00000", "Admin@123", AppUser.Role.ADMIN);
            createIfMissing(users, passwordEncoder, "Viewer User", "viewer@pm.local", "+91 90000 00001", "Viewer@123", AppUser.Role.USER);
        };
    }

    private void createIfMissing(
            AppUserRepository users,
            PasswordEncoder passwordEncoder,
            String fullName,
            String email,
            String phone,
            String password,
            AppUser.Role role) {
        if (users.existsByEmailIgnoreCase(email)) {
            return;
        }

        AppUser user = new AppUser();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        users.save(user);
    }
}
