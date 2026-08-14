package com.LabResourceUtilizationPlatform.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        log.debug("AuthTokenFilter processing: {}", requestUri);

        try {

            // -----------------------------------------
            // Get JWT from Authorization header
            // -----------------------------------------

            String jwt = jwtUtils.getJwtFromHeader(request);

            if (jwt != null && !jwt.isBlank()) {

                log.debug("JWT found for request: {}", requestUri);

                // -----------------------------------------
                // Validate JWT
                // -----------------------------------------

                if (jwtUtils.validateAccessToken(jwt)) {

                    // -----------------------------------------
                    // Get email/username from JWT
                    // -----------------------------------------

                    String username =
                            jwtUtils.getUsernameFromAccessToken(jwt);

                    log.debug(
                            "JWT username/email: {}",
                            username
                    );

                    // -----------------------------------------
                    // Load user
                    // -----------------------------------------

                    UserDetails userDetails =
                            userDetailsService
                                    .loadUserByUsername(username);

                    // -----------------------------------------
                    // Create authentication
                    // -----------------------------------------

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // -----------------------------------------
                    // Set SecurityContext
                    // -----------------------------------------

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);

                    log.debug(
                            "Authenticated user: {}",
                            username
                    );

                    log.debug(
                            "Authorities: {}",
                            userDetails.getAuthorities()
                    );

                } else {

                    log.warn(
                            "Invalid or expired JWT for: {}",
                            requestUri
                    );
                }

            } else {

                log.debug(
                        "No JWT found for request: {}",
                        requestUri
                );
            }

        } catch (Exception e) {

            log.error(
                    "Cannot set user authentication",
                    e
            );

            // Clear invalid authentication
            SecurityContextHolder
                    .clearContext();
        }

        // Continue request
        filterChain.doFilter(request, response);
    }
}