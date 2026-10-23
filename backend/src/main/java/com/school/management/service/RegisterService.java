
package com.school.management.service;

import com.school.management.dto.LoginResponse;
import com.school.management.dto.RegisterRequest;
import com.school.management.entity.AppUser;
import com.school.management.repository.AppUserRepository;
import com.school.management.security.JwtService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class RegisterService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final long expirationMs;

    public RegisterService(
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

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        String fullName = request.getFullName().trim();
        String email = request.getEmail().trim()
                .toLowerCase(Locale.ROOT);
        String password = request.getPassword();

        if (userRepository.existsByEmailIgnoreCase(email)) {
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

        AppUser saved = userRepository.save(user);

        String token = jwtService.create(
                saved.getEmail(), "USER"
        );

        LoginResponse.UserInfo userInfo =
                new LoginResponse.UserInfo(
                        saved.getId(),
                        saved.getFullName(),
                        saved.getEmail(),
                        "USER"
                );

        return new LoginResponse(
                token,
                "Bearer",
                expirationMs,
                userInfo
        );
    }
}
