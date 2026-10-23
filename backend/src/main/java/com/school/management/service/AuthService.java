
package com.school.management.service;

import com.school.management.dto.LoginRequest;
import com.school.management.dto.LoginResponse;
import com.school.management.dto.RegisterRequest;
import com.school.management.entity.AppUser;
import com.school.management.repository.AppUserRepository;
import com.school.management.security.JwtService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final long expirationMs;

    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.expirationMs = expirationMs;
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null
                || request.getEmail() == null
                || request.getPassword() == null
                || request.getEmail().isBlank()
                || request.getPassword().isEmpty()) {
            throw invalidCredentials();
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(this::invalidCredentials);

        if (!user.isEnabled()) {
            throw invalidCredentials();
        }

        String passwordHash = user.getPasswordHash();

        if (passwordHash == null
                || passwordHash.isBlank()
                || !passwordEncoder.matches(
                request.getPassword(),
                passwordHash)) {
            throw invalidCredentials();
        }

        String role = normalizeRole(user.getRole());

        if (!role.equals("ADMIN") && !role.equals("USER")) {
            throw invalidCredentials();
        }

        String token = jwtService.create(user.getEmail(), role);

        LoginResponse.UserInfo userInfo =
                new LoginResponse.UserInfo(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        role
                );

        return new LoginResponse(
                token,
                "Bearer",
                expirationMs,
                userInfo
        );
    }

    public void register(RegisterRequest request) {
        if (request == null
                || request.getFullName() == null
                || request.getEmail() == null
                || request.getPassword() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Full name, email and password are required."
            );
        }

        String fullName = request.getFullName().trim();
        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);
        String password = request.getPassword();

        if (fullName.isBlank()
                || email.isBlank()
                || password.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Full name, email and password are required."
            );
        }

        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered."
            );
        }

        AppUser user = new AppUser();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole("USER");
        user.setEnabled(true);

        userRepository.save(user);
    }

    private String normalizeRole(String value) {
        if (value == null) {
            return "";
        }

        String role = value.trim().toUpperCase(Locale.ROOT);

        if (role.startsWith("ROLE_")) {
            role = role.substring("ROLE_".length());
        }

        return role;
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password."
        );
    }
}
