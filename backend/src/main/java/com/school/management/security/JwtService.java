
package com.school.management.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalArgumentException(
                    "app.jwt.secret must not be empty"
            );
        }

        if (expirationMs <= 0) {
            throw new IllegalArgumentException(
                    "app.jwt.expiration-ms must be greater than zero"
            );
        }

        try {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            this.key = Keys.hmacShaKeyFor(keyBytes);
        } catch (RuntimeException exception) {
            throw new IllegalArgumentException(
                    "app.jwt.secret must be a valid Base64-encoded key " +
                            "of sufficient length for the configured JWT algorithm",
                    exception
            );
        }

        this.expirationMs = expirationMs;
    }

    public String create(String email, String role) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Email is required to create JWT"
            );
        }

        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException(
                    "Role is required to create JWT"
            );
        }

        long now = System.currentTimeMillis();

        return Jwts.builder()
                .subject(email.trim())
                .claim("role", role.trim())
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(key)
                .compact();
    }

    public Claims claims(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException(
                    "JWT token is required"
            );
        }

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String subject(String token) {
        return claims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = claims(token);

            return claims.getSubject() != null
                    && !claims.getSubject().isBlank()
                    && claims.getExpiration() != null
                    && claims.getExpiration().after(new Date());

        } catch (RuntimeException exception) {
            return false;
        }
    }
}
