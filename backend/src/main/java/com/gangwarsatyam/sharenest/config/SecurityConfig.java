package com.gangwarsatyam.sharenest.config;

import com.gangwarsatyam.sharenest.repository.UserRepository;
import com.gangwarsatyam.sharenest.security.JwtProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class SecurityConfig {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public SecurityConfig(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/healthz").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/refresh", "/api/auth/me").authenticated()

                        // Public read-only endpoints
                        .requestMatchers(HttpMethod.GET, "/api/items/**", "/api/trust-score/**", "/api/map-items").permitAll()

                        // Write endpoints (requires auth + role)
                        .requestMatchers(HttpMethod.POST, "/api/items/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/items/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/items/**").hasAnyRole("USER", "ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(
                        org.springframework.security.config.http.SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtFilter(jwtProvider, userRepository),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(username -> userRepository.findByUsername(username)
                .map(user -> user)
                .orElseThrow(() -> new RuntimeException("User not found")));
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        config.addAllowedOrigin(frontendUrl); // Using value from application.yml
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
