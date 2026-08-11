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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(authEntryPointJwt))

                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())

//                .authorizeHttpRequests(auth -> auth
//
//                        // Public APIs
//                        .requestMatchers(
//                                "/api/auth/**",
//                                "/oauth2/**",
//                                "/login/**",
//                                "/error",
//                                "/uploads/**"
//                        ).permitAll()
//
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//
//                        // System Admin
//                        .requestMatchers("/api/system/**")
//                        .hasRole("SYSTEM_ADMIN")
//
//                        // Institution
//                        .requestMatchers(
//                                "/api/institutions/**",
//                                "/api/departments/**"
//                        )
//                        .hasAnyRole(
//                                "SYSTEM_ADMIN",
//                                "INSTITUTION_ADMIN"
//                        )
//
//                        // Waiting Queue
//                        .requestMatchers("/api/waiting-queue/**")
//                        .hasAnyRole(
//                                "SYSTEM_ADMIN",
//                                "INSTITUTION_ADMIN",
//                                "LAB_MANAGER"
//                        )
//
//                        // Labs & Equipment
//                        .requestMatchers(
//                                "/api/labs/**",
//                                "/api/equipment/**"
//                        )
//                        .hasAnyRole(LAB_USERS)
//
//                        // Bookings
//                        .requestMatchers("/api/bookings/**")
//                        .hasAnyRole(BOOKING_USERS)
//
//                        // Maintenance
//                        .requestMatchers("/api/maintenance/**")
//                        .hasAnyRole(
//                                "SYSTEM_ADMIN",
//                                "INSTITUTION_ADMIN",
//                                "DEPARTMENT_HEAD",
//                                "LAB_MANAGER",
//                                "LAB_TECHNICIAN"
//                        )
//
//                        // Sharing
//                        .requestMatchers("/api/sharing/**")
//                        .hasAnyRole(
//                                "SYSTEM_ADMIN",
//                                "INSTITUTION_ADMIN",
//                                "DEPARTMENT_HEAD",
//                                "LAB_MANAGER",
//                                "RESEARCHER",
//                                "RESEARCH_ASSOCIATE",
//                                "RESEARCH_SCIENTIST"
//                        )
//
//                        // Dashboard & Notifications
//                        .requestMatchers(
//                                "/api/dashboard/**",
//                                "/api/notifications/**"
//                        )
//                        .authenticated()
//
//                        // User Management
//                        .requestMatchers("/api/users/**")
//                        .hasAnyRole(
//                                "SYSTEM_ADMIN",
//                                "INSTITUTION_ADMIN"
//                        )
//
//                        .anyRequest().authenticated()
//                )

                .oauth2Login(oauth -> oauth
                        .successHandler(oAuth2SuccessHandler)
                        .failureUrl("http://localhost:5173/login?error=true")
                );

        http.addFilterBefore(
                authTokenFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin"
        ));

        configuration.setExposedHeaders(List.of(
                "Authorization"
        ));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
}