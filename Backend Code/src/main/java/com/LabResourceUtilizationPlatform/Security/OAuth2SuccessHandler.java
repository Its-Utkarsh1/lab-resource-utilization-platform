package com.LabResourceUtilizationPlatform.Security;

import com.LabResourceUtilizationPlatform.Entity.User;
import com.LabResourceUtilizationPlatform.Repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;

    private static final String FRONTEND_URL =
            "http://localhost:3000";

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User googleUser =
                (OAuth2User) authentication.getPrincipal();

        String googleId =
                googleUser.getAttribute("sub");

        String email =
                googleUser.getAttribute("email");

        String name =
                googleUser.getAttribute("name");

        if (email != null) {
            email = email.trim().toLowerCase();
        }

        log.info("========== GOOGLE LOGIN ==========");
        log.info("Google ID: {}", googleId);
        log.info("Google Email: {}", email);
        log.info("Google Name: {}", name);

        // =====================================================
        // VALIDATE GOOGLE RESPONSE
        // =====================================================

        if (
                email == null ||
                        email.isBlank() ||
                        googleId == null ||
                        googleId.isBlank()
        ) {

            response.sendRedirect(
                    FRONTEND_URL +
                            "/login?error=google_data_missing"
            );

            return;
        }

        // =====================================================
        // FIND EXISTING APPLICATION USER
        // =====================================================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        // =====================================================
        // GOOGLE LOGIN ONLY
        // =====================================================

        if (user == null) {

            log.warn(
                    "Google account is not registered: {}",
                    email
            );

            response.sendRedirect(
                    FRONTEND_URL +
                            "/login?error=google_account_not_registered"
            );

            return;
        }

        // =====================================================
        // LINK GOOGLE ACCOUNT
        // =====================================================

        if (user.getGoogleId() == null) {

            user.setGoogleId(googleId);
            user.setAuthProvider("GOOGLE");

            userRepository.save(user);

            log.info(
                    "Google account linked to: {}",
                    email
            );

        } else if (
                !googleId.equals(user.getGoogleId())
        ) {

            log.warn(
                    "Google ID mismatch for: {}",
                    email
            );

            response.sendRedirect(
                    FRONTEND_URL +
                            "/login?error=google_account_mismatch"
            );

            return;
        }

        // =====================================================
        // LOAD USER DETAILS
        // =====================================================

        UserDetails userDetails =
                userDetailsService
                        .loadUserByUsername(email);

        // =====================================================
        // GENERATE APPLICATION JWT
        // =====================================================

        String accessToken =
                jwtUtils.generateAccessToken(
                        userDetails
                );

        log.info(
                "Google login successful: {}",
                email
        );

        // =====================================================
        // SEND JWT TO FRONTEND
        // =====================================================

        response.sendRedirect(
                FRONTEND_URL +
                        "/oauth-success?token=" +
                        accessToken
        );
    }
}