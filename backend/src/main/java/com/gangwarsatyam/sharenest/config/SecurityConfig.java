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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@Configuration
public class SecurityConfig {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    public SecurityConfig(JwtProvider jwtProvider, UserRepository userRepository, AppProperties appProperties) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
        this.appProperties = appProperties;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/health").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/signup", "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/check-username", "/api/auth/check-email").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/auth/me", "/api/auth/refresh").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/items/**", "/api/trust-score/**", "/api/map-items").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/items/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/items/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/items/**").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated()
                )

                .sessionManagement(session -> session.sessionCreationPolicy(
                        org.springframework.security.config.http.SessionCreationPolicy.STATELESS))

                .addFilterBefore(new JwtFilter(jwtProvider, userRepository),
                        UsernamePasswordAuthenticationFilter.class)

                .addFilterAfter((request, response, chain) -> {
                    var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                    if (auth != null && auth.isAuthenticated() && request instanceof HttpServletRequest httpReq) {
                        log.debug("[SecurityConfig] User '{}' with roles {} accessed {} {}",
                                auth.getName(),
                                auth.getAuthorities(),
                                httpReq.getMethod(),
                                httpReq.getRequestURI());
                    }
                    chain.doFilter(request, response);
                }, UsernamePasswordAuthenticationFilter.class)

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(CustomUserDetailsService customUserDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
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
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("*"));
        config.setAllowedOrigins(appProperties.getFrontendUrl());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
