
package com.school.management.config;

import com.school.management.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

 @Bean
 public PasswordEncoder passwordEncoder() {
  return new BCryptPasswordEncoder();
 }

 @Bean
 public SecurityFilterChain securityFilterChain(
         HttpSecurity http,
         JwtAuthenticationFilter jwtFilter
 ) throws Exception {

  http
          .csrf(csrf -> csrf.disable())

          .cors(Customizer.withDefaults())

          .sessionManagement(session ->
                  session.sessionCreationPolicy(
                          SessionCreationPolicy.STATELESS
                  )
          )

          .authorizeHttpRequests(auth -> auth

                  // Allow browser CORS preflight requests
                  .requestMatchers(
                          HttpMethod.OPTIONS, "/**"
                  ).permitAll()

                  // Public authentication endpoints
                  .requestMatchers(
                          HttpMethod.POST,
                          "/api/auth/login",
                          "/api/auth/register"
                  ).permitAll()

                  // Public health check and error endpoint
                  .requestMatchers(
                          "/api/health",
                          "/error"
                  ).permitAll()

                  // STUDENTS: ADMIN can create, update and delete
                  .requestMatchers(
                          HttpMethod.POST,
                          "/api/students",
                          "/api/students/**"
                  ).hasRole("ADMIN")

                  .requestMatchers(
                          HttpMethod.PUT,
                          "/api/students",
                          "/api/students/**"
                  ).hasRole("ADMIN")

                  .requestMatchers(
                          HttpMethod.PATCH,
                          "/api/students",
                          "/api/students/**"
                  ).hasRole("ADMIN")

                  .requestMatchers(
                          HttpMethod.DELETE,
                          "/api/students",
                          "/api/students/**"
                  ).hasRole("ADMIN")

                  // Both ADMIN and USER can view students
                  .requestMatchers(
                          HttpMethod.GET,
                          "/api/students",
                          "/api/students/**"
                  ).hasAnyRole("ADMIN", "USER")

                  // ATTENDANCE: Both roles can view and record attendance
                  .requestMatchers(
                          HttpMethod.GET,
                          "/api/attendance",
                          "/api/attendance/**"
                  ).hasAnyRole("ADMIN", "USER")

                  .requestMatchers(
                          HttpMethod.POST,
                          "/api/attendance",
                          "/api/attendance/**"
                  ).hasAnyRole("ADMIN", "USER")

                  .requestMatchers(
                          HttpMethod.PUT,
                          "/api/attendance",
                          "/api/attendance/**"
                  ).hasAnyRole("ADMIN", "USER")

                  .requestMatchers(
                          HttpMethod.PATCH,
                          "/api/attendance",
                          "/api/attendance/**"
                  ).hasAnyRole("ADMIN", "USER")

                  // Only ADMIN can delete attendance records
                  .requestMatchers(
                          HttpMethod.DELETE,
                          "/api/attendance",
                          "/api/attendance/**"
                  ).hasRole("ADMIN")

                  // Admin-only endpoints
                  .requestMatchers(
                          "/api/admin/**"
                  ).hasRole("ADMIN")

                  // Everything else requires authentication
                  .anyRequest().authenticated()
          )

          .addFilterBefore(
                  jwtFilter,
                  UsernamePasswordAuthenticationFilter.class
          );

  return http.build();
 }

 @Bean
 public CorsConfigurationSource corsConfigurationSource(
         @Value("${app.cors.allowed-origin:http://localhost:5173}")
         String origin
 ) {

  CorsConfiguration config = new CorsConfiguration();

  config.setAllowedOrigins(List.of(
          origin,
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          "http://localhost:3000",
          "http://localhost:5175"
  ));

  config.setAllowedMethods(List.of(
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
          "OPTIONS"
  ));

  config.setAllowedHeaders(List.of(
          "Authorization",
          "Content-Type",
          "Accept"
  ));

  config.setAllowCredentials(false);

  UrlBasedCorsConfigurationSource source =
          new UrlBasedCorsConfigurationSource();

  source.registerCorsConfiguration("/**", config);

  return source;
 }
}
