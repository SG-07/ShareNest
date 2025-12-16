package com.gangwarsatyam.sharenest.config;

import com.gangwarsatyam.sharenest.model.User;
import com.gangwarsatyam.sharenest.repository.UserRepository;
import com.gangwarsatyam.sharenest.security.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "jwt.filter.enabled",
        havingValue = "true",
        matchIfMissing = true // filter is ON unless explicitly disabled
)
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        log.debug("---- [JwtFilter] Incoming request: {} {}", request.getMethod(), request.getRequestURI());

        try {
            String token = getJwtFromRequest(request);

            if (!StringUtils.hasText(token)) {
                log.debug("[JwtFilter] No JWT token found in Authorization header");
            } else {
                log.debug("[JwtFilter] Extracted Token: {}", token);
            }

            if (StringUtils.hasText(token)) {

                boolean valid = jwtProvider.validate(token);
                log.debug("[JwtFilter] Token validation result: {}", valid);

                if (!valid) {
                    log.warn("[JwtFilter] Token is INVALID or EXPIRED");
                }

                if (valid) {
                    String username = jwtProvider.getUsername(token);
                    log.debug("[JwtFilter] Extracted username from token: {}", username);

                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> {
                                log.error("[JwtFilter] No user found for username: {}", username);
                                return new RuntimeException("User not found: " + username);
                            });

                    log.debug("[JwtFilter] User found in DB. Username: {}, Roles: {}",
                            user.getUsername(), user.getRoles());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user.getUsername(),
                                    null,
                                    user.getRoles().stream()
                                            .map(SimpleGrantedAuthority::new)
                                            .collect(Collectors.toList())
                            );

                    log.debug("[JwtFilter] Authorities assigned: {}", authentication.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    log.debug("[JwtFilter] User authenticated successfully: {}", username);
                }
            }

        } catch (Exception ex) {
            log.error("[JwtFilter] Exception during JWT processing", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");

        log.debug("[JwtFilter] Authorization header received: {}", bearer);

        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }

        log.warn("[JwtFilter] Authorization header missing or does not start with 'Bearer '");
        return null;
    }
}
