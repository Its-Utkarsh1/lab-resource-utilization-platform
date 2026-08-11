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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtils jwtUtils;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email != null) {
            email = email.trim().toLowerCase();
        }

        log.info("=========== GOOGLE LOGIN ===========");
        log.info("Google Name  : {}", name);
        log.info("Google Email : {}", email);

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            log.warn("User not found with email: {}", email);

            response.sendRedirect(
                    "http://localhost:3000/login?error=" +
                            URLEncoder.encode(
                                    "Please register first.",
                                    StandardCharsets.UTF_8
                            )
            );
            return;
        }

        log.info("User found: {}", user.getEmail());

        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername(user.getEmail());

        String token = jwtUtils.generateAccessToken(userDetails);

        log.info("JWT generated successfully.");

        response.sendRedirect(
                "http://localhost:3000/oauth-success?token=" + token
        );
    }
}