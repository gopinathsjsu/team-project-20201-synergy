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

import static com.sjsu.booktable.model.enums.Role.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(CsrfConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Allow OPTIONS requests for CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public endpoints
                        .requestMatchers("/api/auth/**", "/api/home/**", "/api/s3/**", "/actuator/health").permitAll()
                        // Protected endpoints
                        .requestMatchers("/api/customer/**").hasAuthority(CUSTOMER.getName())
                        .requestMatchers("/api/manager/**").hasAuthority(RESTAURANT_MANAGER.getName())
                        .requestMatchers("/api/admin/**").hasAuthority(ADMIN.getName())
                        .requestMatchers("/api/booking/**").hasAuthority(CUSTOMER.getName())
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .bearerTokenResolver(request -> {
                            // Skip token resolution for public endpoints
                            String path = request.getServletPath();
                            if (path.startsWith("/api/auth/otp") || "OPTIONS".equals(request.getMethod())) {
                                return null;
                            }
                            // Extract token from cookie for protected endpoints
                            if (request.getCookies() != null) {
                                for (Cookie cookie : request.getCookies()) {
                                    if ("api-token".equals(cookie.getName())) {
                                        return cookie.getValue();
                                    }
                                }
                            }
                            return null;
                        })
                );
        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            List<String> groups = jwt.getClaimAsStringList("cognito:groups");
            return groups != null ? groups.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList()) : Collections.emptyList();
        });
        return converter;
    }

}