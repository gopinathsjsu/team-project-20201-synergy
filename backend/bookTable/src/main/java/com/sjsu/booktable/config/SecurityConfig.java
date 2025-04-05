package com.sjsu.booktable.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                        .requestMatchers("/api/auth/**").permitAll() // login and logout
                        .requestMatchers("/api/customer/**").hasAuthority(CUSTOMER.getName())
                        .requestMatchers("/api/manager/**").hasAuthority(RESTAURANT_MANAGER.getName())
                        .requestMatchers("/api/admin/**").hasAuthority(ADMIN.getName())
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .bearerTokenResolver(request -> request.getHeader("api-token"))  // Custom header
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
