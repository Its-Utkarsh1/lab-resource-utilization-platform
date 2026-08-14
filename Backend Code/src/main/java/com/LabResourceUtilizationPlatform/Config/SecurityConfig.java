package com.LabResourceUtilizationPlatform.Config;

import com.LabResourceUtilizationPlatform.Security.AuthEntryPointJwt;
import com.LabResourceUtilizationPlatform.Security.AuthTokenFilter;
import com.LabResourceUtilizationPlatform.Security.OAuth2SuccessHandler;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter;

    private final AuthEntryPointJwt authEntryPointJwt;

    private final OAuth2SuccessHandler oAuth2SuccessHandler;


    // =========================================================
    // LAB USERS
    // =========================================================

    private static final String[] LAB_USERS = {
            "SYSTEM_ADMIN",
            "INSTITUTION_ADMIN",
            "DEPARTMENT_HEAD",
            "LAB_MANAGER",
            "LAB_TECHNICIAN",
            "PROFESSOR",
            "ASSOCIATE_PROFESSOR",
            "ASSISTANT_PROFESSOR",
            "RESEARCHER",
            "RESEARCH_ASSOCIATE",
            "RESEARCH_SCIENTIST",
            "STUDENT"
    };


    // =========================================================
    // BOOKING USERS
    // =========================================================

    private static final String[] BOOKING_USERS = {
            "SYSTEM_ADMIN",
            "INSTITUTION_ADMIN",
            "DEPARTMENT_HEAD",
            "LAB_MANAGER",
            "PROFESSOR",
            "ASSOCIATE_PROFESSOR",
            "ASSISTANT_PROFESSOR",
            "RESEARCHER",
            "RESEARCH_ASSOCIATE",
            "RESEARCH_SCIENTIST",
            "STUDENT"
    };


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =================================================
                // CORS
                // =================================================

                .cors(Customizer.withDefaults())


                // =================================================
                // CSRF
                // =================================================

                .csrf(AbstractHttpConfigurer::disable)


                // =================================================
                // SESSION
                //
                // OAuth2 needs a temporary session during the
                // Google authentication process.
                //
                // JWT is still used for normal API authentication.
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )


                // =================================================
                // EXCEPTION HANDLING
                // =================================================

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                authEntryPointJwt
                        )
                )


                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth


                        // =================================================
                        // PUBLIC AUTHENTICATION
                        // =================================================

                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/verify-email",
                                "/api/auth/resend-otp",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/auth/refresh-token"
                        ).permitAll()


                        // =================================================
                        // CURRENT USER
                        // =================================================

                        .requestMatchers(
                                "/api/auth/me"
                        ).authenticated()


                        // =================================================
                        // GOOGLE OAUTH2
                        // =================================================

                        .requestMatchers(
                                "/oauth2/**",
                                "/login/oauth2/**"
                        ).permitAll()


                        // =================================================
                        // ERROR
                        // =================================================

                        .requestMatchers(
                                "/error"
                        ).permitAll()


                        // =================================================
                        // UPLOADS
                        // =================================================

                        .requestMatchers(
                                "/uploads/**"
                        ).permitAll()


                        // =================================================
                        // CORS PREFLIGHT
                        // =================================================

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // =================================================
                        // SYSTEM ADMIN
                        // =================================================

                        .requestMatchers(
                                "/api/system/**"
                        )
                        .hasRole("SYSTEM_ADMIN")


                        // =================================================
                        // INSTITUTION / DEPARTMENT
                        // =================================================

                        .requestMatchers(
                                "/api/institutions/**",
                                "/api/departments/**"
                        )
                        .hasAnyRole(
                                "SYSTEM_ADMIN",
                                "INSTITUTION_ADMIN"
                        )


                        // =================================================
                        // MY WAITING QUEUE
                        //
                        // Every normal lab user can see their own queue.
                        // =================================================

                        .requestMatchers(
                                "/api/waiting-queue/my"
                        )
                        .hasAnyRole(
                                "SYSTEM_ADMIN",
                                "INSTITUTION_ADMIN",
                                "DEPARTMENT_HEAD",
                                "LAB_MANAGER",
                                "LAB_TECHNICIAN",
                                "PROFESSOR",
                                "ASSOCIATE_PROFESSOR",
                                "ASSISTANT_PROFESSOR",
                                "RESEARCHER",
                                "RESEARCH_ASSOCIATE",
                                "RESEARCH_SCIENTIST",
                                "STUDENT"
                        )


                        // =================================================
                        // EQUIPMENT WAITING QUEUE
                        //
                        // Used to inspect the queue of particular equipment.
                        // =================================================

                        .requestMatchers(
                                "/api/waiting-queue/equipment/**"
                        )
                        .hasAnyRole(
                                "SYSTEM_ADMIN",
                                "INSTITUTION_ADMIN",
                                "DEPARTMENT_HEAD",
                                "LAB_MANAGER",
                                "LAB_TECHNICIAN"
                        )


                        // =================================================
                        // REMOVE WAITING QUEUE ENTRY
                        //
                        // Authorization is also checked inside the service
                        // to ensure the user can only remove their own entry.
                        // =================================================

                        .requestMatchers(
                                "/api/waiting-queue/*"
                        )
                        .hasAnyRole(
                                "SYSTEM_ADMIN",
                                "INSTITUTION_ADMIN",
                                "DEPARTMENT_HEAD",
                                "LAB_MANAGER",
                                "LAB_TECHNICIAN",
                                "PROFESSOR",
                                "ASSOCIATE_PROFESSOR",
                                "ASSISTANT_PROFESSOR",
                                "RESEARCHER",
                                "RESEARCH_ASSOCIATE",
                                "RESEARCH_SCIENTIST",
                                "STUDENT"
                        )


                        // =================================================
                        // LABS & EQUIPMENT
                        // =================================================

                        .requestMatchers(
                                "/api/labs/**",
                                "/api/equipment/**"
                        )
                        .hasAnyRole(LAB_USERS)


                        // =================================================
                        // BOOKINGS
                        // =================================================

                        .requestMatchers(
                                "/api/bookings/**"
                        )
                        .hasAnyRole(BOOKING_USERS)


                        // =================================================
                        // MAINTENANCE
                        // =================================================

                        .requestMatchers(
                                "/api/maintenance/**"
                        )
                        .hasAnyRole(
                                "SYSTEM_ADMIN",
                                "INSTITUTION_ADMIN",
                                "DEPARTMENT_HEAD",
                                "LAB_MANAGER",
                                "LAB_TECHNICIAN"
                        )


                        // =================================================
                        // SHARING
                        // =================================================

                        .requestMatchers(
                                "/api/sharing/**"
                        )
                        .hasAnyRole(
                                "SYSTEM_ADMIN",
                                "INSTITUTION_ADMIN",
                                "DEPARTMENT_HEAD",
                                "LAB_MANAGER",
                                "RESEARCHER",
                                "RESEARCH_ASSOCIATE",
                                "RESEARCH_SCIENTIST"
                        )


                        // =================================================
                        // DASHBOARD & NOTIFICATIONS
                        // =================================================

                        .requestMatchers(
                                "/api/dashboard/**",
                                "/api/notifications/**"
                        )
                        .authenticated()


                        // =================================================
                        // USER MANAGEMENT
                        // =================================================

                        .requestMatchers(
                                "/api/users/**"
                        )
                        .hasAnyRole(
                                "SYSTEM_ADMIN",
                                "INSTITUTION_ADMIN"
                        )


                        // =================================================
                        // EVERYTHING ELSE
                        // =================================================

                        .anyRequest()
                        .authenticated()
                )


                // =================================================
                // GOOGLE LOGIN
                // =================================================

                .oauth2Login(oauth ->
                        oauth
                                .successHandler(
                                        oAuth2SuccessHandler
                                )
                                .failureUrl(
                                        "http://localhost:3000/login?error=google_login_failed"
                                )
                );

        http.addFilterBefore(
                authTokenFilter,
                UsernamePasswordAuthenticationFilter.class
        );


        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:3000",
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin"
                )
        );

        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }
}