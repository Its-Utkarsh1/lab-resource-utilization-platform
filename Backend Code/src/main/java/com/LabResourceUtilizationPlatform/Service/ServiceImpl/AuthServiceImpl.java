package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Request.*;
import com.LabResourceUtilizationPlatform.Dtos.Response.AuthResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.UserResponse;
import com.LabResourceUtilizationPlatform.Entity.Enum.OtpPurpose;
import com.LabResourceUtilizationPlatform.Entity.User;
import com.LabResourceUtilizationPlatform.Repository.DepartmentRepository;
import com.LabResourceUtilizationPlatform.Repository.InstitutionRepository;
import com.LabResourceUtilizationPlatform.Repository.RoleRepository;
import com.LabResourceUtilizationPlatform.Repository.UserRepository;
import com.LabResourceUtilizationPlatform.Security.JwtUtils;
import com.LabResourceUtilizationPlatform.Service.AuthService;

import com.LabResourceUtilizationPlatform.Service.OtpService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtUtils jwtUtils;

    private final OtpService otpService;

    private final UserRepository userRepository;

    private final UserDetailsService userDetailsService;

    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    private final ModelMapper modelMapper;

    private final InstitutionRepository institutionRepository;

    private final DepartmentRepository departmentRepository;

    private final RoleRepository roleRepository;

    private static final Logger logger =
            LoggerFactory.getLogger(AuthServiceImpl.class);


    // =========================================================
    // LOGIN
    // =========================================================

    @Override
    public AuthResponse login(LoginRequest request) {

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found."
                                )
                        );

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        logger.info(
                "Login email = {}",
                email
        );

        // -----------------------------------------
        // Check email verification
        // -----------------------------------------

        if (!user.getEmailVerified()) {

            throw new RuntimeException(
                    "Please verify your email first."
            );
        }

        // -----------------------------------------
        // Authenticate
        // -----------------------------------------

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        // -----------------------------------------
        // Load authenticated user
        // -----------------------------------------

        UserDetails userDetails =
                userDetailsService
                        .loadUserByUsername(email);

        // -----------------------------------------
        // Generate tokens
        // -----------------------------------------

        String accessToken =
                jwtUtils.generateAccessToken(
                        userDetails
                );

        String refreshToken =
                jwtUtils.generateRefreshToken(
                        userDetails
                );

        logger.info(
                "User logged in successfully: {}",
                email
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(
                        user.getRole()
                                .getRoleName()
                                .name()
                )
                .institutionCode(
                        user.getInstitution()
                                .getCode()
                )
                .institutionName(
                        user.getInstitution()
                                .getName()
                )
                .departmentName(
                        user.getDepartment()
                                .getName()
                )
                .emailVerified(
                        user.getEmailVerified()
                )
                .build();
    }


    // =========================================================
    // GET CURRENT USER
    // =========================================================

    @Override
    @Transactional
    public UserResponse getCurrentUser() {

        var authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (
                authentication == null
                        || !authentication.isAuthenticated()
        ) {

            throw new RuntimeException(
                    "No authentication found."
            );
        }

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found: "
                                                + email
                                )
                        );

        UserResponse response =
                modelMapper.map(
                        user,
                        UserResponse.class
                );

        response.setRole(
                user.getRole()
                        .getRoleName()
                        .name()
        );

        response.setInstitution(
                user.getInstitution()
                        .getName()
        );

        response.setDepartment(
                user.getDepartment()
                        .getName()
        );

        return response;
    }


    // =========================================================
    // VERIFY EMAIL OTP
    // =========================================================

    @Override
    @Transactional
    public void verifyEmail(
            VerifyEmailRequest request
    ) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found."
                                )
                        );

        // -----------------------------------------
        // Already verified
        // -----------------------------------------

        if (user.getEmailVerified()) {

            throw new RuntimeException(
                    "Email is already verified."
            );
        }

        // -----------------------------------------
        // Verify OTP from PostgreSQL
        // -----------------------------------------

        otpService.verifyOtp(
                email,
                request.getOtp(),
                OtpPurpose.VERIFY_EMAIL
        );

        // -----------------------------------------
        // Mark email verified
        // -----------------------------------------

        user.setEmailVerified(true);

        userRepository.save(user);

        logger.info(
                "Email verified successfully: {}",
                email
        );
    }


    // =========================================================
    // RESEND EMAIL OTP
    // =========================================================

    @Override
    public void resendOtp(
            ResendOtpRequest request
    ) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found."
                                )
                        );

        // -----------------------------------------
        // Already verified
        // -----------------------------------------

        if (user.getEmailVerified()) {

            throw new RuntimeException(
                    "Email is already verified."
            );
        }

        // -----------------------------------------
        // Generate + save + send OTP
        // -----------------------------------------

        otpService.generateAndSendOtp(
                email,
                OtpPurpose.VERIFY_EMAIL
        );

        logger.info(
                "OTP resent successfully to {}",
                email
        );
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @Override
    public void forgotPassword(
            ForgotPasswordRequest request
    ) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        logger.info(
                "Forgot password requested for {}",
                email
        );

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found."
                                )
                        );

        // -----------------------------------------
        // Generate + save + send OTP
        // -----------------------------------------

        otpService.generateAndSendOtp(
                user.getEmail(),
                OtpPurpose.FORGOT_PASSWORD
        );

        logger.info(
                "Password reset OTP sent to {}",
                email
        );
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @Override
    @Transactional
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found."
                                )
                        );

        // -----------------------------------------
        // Verify OTP from PostgreSQL
        // -----------------------------------------

        otpService.verifyOtp(
                email,
                request.getOtp(),
                OtpPurpose.FORGOT_PASSWORD
        );

        // -----------------------------------------
        // Update password
        // -----------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        logger.info(
                "Password reset successfully for {}",
                email
        );
    }


    // =========================================================
    // REFRESH TOKEN
    // =========================================================

    @Override
    public AuthResponse refreshToken(
            RefreshTokenRequest request
    ) {

        if (
                !jwtUtils.validateRefreshToken(
                        request.getRefreshToken()
                )
        ) {

            throw new RuntimeException(
                    "Invalid or expired refresh token."
            );
        }

        String email =
                jwtUtils.getUsernameFromRefreshToken(
                        request.getRefreshToken()
                );

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found."
                                )
                        );

        UserDetails userDetails =
                userDetailsService
                        .loadUserByUsername(email);

        String newAccessToken =
                jwtUtils.generateAccessToken(
                        userDetails
                );

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(
                        request.getRefreshToken()
                )
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(
                        user.getRole()
                                .getRoleName()
                                .name()
                )
                .institutionCode(
                        user.getInstitution()
                                .getCode()
                )
                .institutionName(
                        user.getInstitution()
                                .getName()
                )
                .departmentName(
                        user.getDepartment()
                                .getName()
                )
                .emailVerified(
                        user.getEmailVerified()
                )
                .build();
    }
}