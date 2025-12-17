package com.gangwarsatyam.sharenest.config;

import com.gangwarsatyam.sharenest.repository.UserRepository;
import com.gangwarsatyam.sharenest.security.JwtProvider;
import com.gangwarsatyam.sharenest.service.CustomUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Slf4j
@Configuration
public class SecurityConfig {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final AppProperties appProperties;
    private final JwtFilter jwtFilter;

    public SecurityConfig(
            JwtProvider jwtProvider,
            UserRepository userRepository,
            AppProperties appProperties,
            JwtFilter jwtFilter
    ) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
        this.appProperties = appProperties;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // -----------------------------
                        // PUBLIC ENDPOINTS
                        // -----------------------------
                        .requestMatchers("/", "/healthz").permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/auth/signup",
                                "/api/auth/login"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/auth/check-username",
                                "/api/auth/check-email"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/items/**",
                                "/api/trust-score/**",
                                "/api/map-items"
                        ).permitAll()

                        // -----------------------------
                        // PROTECTED ENDPOINTS
                        // -----------------------------
                        .requestMatchers(HttpMethod.POST, "/api/items").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/items/{itemId}/request").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/items/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/items/**").hasAnyRole("USER", "ADMIN")

                        // -----------------------------
                        // EVERYTHING ELSE
                        // -----------------------------
                        .anyRequest().authenticated()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }

    // -----------------------------
    // AUTHENTICATION
    // -----------------------------

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            CustomUserDetailsService customUserDetailsService
    ) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // -----------------------------
    // CORS CONFIGURATION (FIXED)
    // -----------------------------

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        String frontendUrl = appProperties.getFrontendUrl();

        if (frontendUrl != null && !frontendUrl.isBlank()) {
            log.info("CORS allowed origin set to: {}", frontendUrl);
            config.setAllowedOriginPatterns(List.of(frontendUrl));
        } else {
            log.warn("FRONTEND_URL not set. Falling back to allow all origins.");
            config.setAllowedOriginPatterns(List.of("*"));
        }

        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        );
        config.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
