package com.sjsu.booktable.config;

import jakarta.servlet.http.Cookie;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

// Import the Role enum
import static com.sjsu.booktable.model.enums.Role.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(CsrfConfigurer::disable) // Disable CSRF protection
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Use stateless sessions
                // --- Original Security Rules ---
                .authorizeHttpRequests(auth -> auth
                        // Allow OPTIONS requests for CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public endpoints (Login/OTP flow)
                        .requestMatchers("/api/auth/**").permitAll()
                        // Protected endpoints based on Role
                        .requestMatchers("/api/customer/**").hasAuthority(CUSTOMER.getName())
                        .requestMatchers("/api/manager/**").hasAuthority(RESTAURANT_MANAGER.getName())
                        .requestMatchers("/api/admin/**").hasAuthority(ADMIN.getName())
                        // All other requests require authentication (catch-all)
                        .anyRequest().authenticated()
                )
                // --- End of Original Security Rules ---
                .oauth2ResourceServer(oauth2 -> oauth2 // Configure as OAuth2 Resource Server
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())) // Use custom JWT converter
                        .bearerTokenResolver(request -> { // Define how to find the token
                            // Skip token resolution for public auth endpoints or OPTIONS requests
                            String path = request.getServletPath();
                            if (path.startsWith("/api/auth/") || HttpMethod.OPTIONS.matches(request.getMethod())) {
                                return null; // Don't look for a token
                            }
                            // Extract token from 'api-token' cookie for other requests
                            if (request.getCookies() != null) {
                                for (Cookie cookie : request.getCookies()) {
                                    if ("api-token".equals(cookie.getName())) {
                                        return cookie.getValue(); // Return token value if found
                                    }
                                }
                            }
                            // Return null if token cookie not found
                            return null;
                        })
                );
        return http.build(); // Build the security filter chain
    }

    // Bean to configure how roles/authorities are extracted from the JWT
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        // Look for the 'cognito:groups' claim in the JWT
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<String> groups = jwt.getClaimAsStringList("cognito:groups");
            // Map Cognito groups (like 'Admin', 'Customer') to Spring Security Authorities
            return groups != null ? groups.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList()) : Collections.emptyList();
        });
        return converter;
    }

}