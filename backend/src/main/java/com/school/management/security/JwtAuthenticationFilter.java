package com.school.management.security;

import com.school.management.entity.AppUser;
import com.school.management.repository.AppUserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwt;
    private final AppUserRepository users;

    public JwtAuthenticationFilter(
            JwtService jwt,
            AppUserRepository users
    ) {
        this.jwt = jwt;
        this.users = users;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null
                || !header.startsWith("Bearer ")
                || SecurityContextHolder.getContext().getAuthentication() != null) {

            chain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(7).trim();

            if (token.isEmpty() || !jwt.isTokenValid(token)) {
                SecurityContextHolder.clearContext();
                chain.doFilter(request, response);
                return;
            }

            String email = jwt.subject(token);

            if (email == null || email.isBlank()) {
                SecurityContextHolder.clearContext();
                chain.doFilter(request, response);
                return;
            }

            Optional<AppUser> found = users.findByEmailIgnoreCase(email.trim());

            if (found.isPresent() && found.get().isEnabled()) {
                AppUser user = found.get();
                String role = normalizeRole(user.getRole());

                if (role.equals("ADMIN") || role.equals("USER")) {
                    var authentication = new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    log.warn("JWT user '{}' has unsupported role '{}'", email, role);
                }
            } else {
                log.debug("JWT user '{}' not found or disabled", email);
            }

        } catch (Exception exception) {
            // Do not leak details to the client, but keep a log for debugging
            log.warn("JWT authentication failed: {}", exception.getMessage());
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(request, response);
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
}