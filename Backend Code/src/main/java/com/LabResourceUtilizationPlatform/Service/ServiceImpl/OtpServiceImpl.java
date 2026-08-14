package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Entity.Enum.OtpPurpose;
import com.LabResourceUtilizationPlatform.Entity.OtpVerification;
import com.LabResourceUtilizationPlatform.Repository.OtpVerificationRepository;
import com.LabResourceUtilizationPlatform.Service.OtpService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {

    private final OtpVerificationRepository otpRepository;

    private final JavaMailSender mailSender;

    private final PasswordEncoder passwordEncoder;

    private static final int OTP_EXPIRY_MINUTES = 10;

    private static final int MAX_ATTEMPTS = 5;

    private final SecureRandom secureRandom = new SecureRandom();


    // =========================================================
    // GENERATE + SAVE + SEND OTP
    // =========================================================

    @Override
    @Transactional
    public void generateAndSendOtp(
            String email,
            OtpPurpose purpose
    ) {

        email = email.trim().toLowerCase();

        // Remove previous unused OTP
        otpRepository.deleteByEmailAndPurpose(
                email,
                purpose
        );

        // Generate OTP
        String otp = generateOtp();

        // Hash OTP before storing
        String otpHash =
                passwordEncoder.encode(otp);

        LocalDateTime now =
                LocalDateTime.now();

        // Save OTP in PostgreSQL
        OtpVerification verification =
                OtpVerification.builder()
                        .email(email)
                        .otpHash(otpHash)
                        .purpose(purpose)
                        .expiresAt(
                                now.plusMinutes(
                                        OTP_EXPIRY_MINUTES
                                )
                        )
                        .used(false)
                        .attempts(0)
                        .createdAt(now)
                        .build();

        otpRepository.save(verification);

        // Send OTP
        sendOtpEmail(
                email,
                otp,
                purpose
        );

        log.info(
                "OTP generated and saved for {} [{}]",
                email,
                purpose
        );
    }


    // =========================================================
    // VERIFY OTP
    // =========================================================

    @Override
    @Transactional
    public void verifyOtp(
            String email,
            String otp,
            OtpPurpose purpose
    ) {

        email = email.trim().toLowerCase();

        OtpVerification verification =
                otpRepository
                        .findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(
                                email,
                                purpose
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "OTP has expired or does not exist."
                                )
                        );

        // Check attempts
        if (
                verification.getAttempts()
                        >= MAX_ATTEMPTS
        ) {

            verification.setUsed(true);

            otpRepository.save(
                    verification
            );

            throw new RuntimeException(
                    "Maximum OTP attempts exceeded."
            );
        }

        // Check expiry
        if (
                verification.getExpiresAt()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            verification.setUsed(true);

            otpRepository.save(
                    verification
            );

            throw new RuntimeException(
                    "OTP has expired."
            );
        }

        // Check OTP
        boolean matches =
                passwordEncoder.matches(
                        otp,
                        verification.getOtpHash()
                );

        if (!matches) {

            verification.setAttempts(
                    verification.getAttempts() + 1
            );

            otpRepository.save(
                    verification
            );

            throw new RuntimeException(
                    "Invalid OTP."
            );
        }

        // OTP successfully verified
        verification.setUsed(true);

        otpRepository.save(
                verification
        );

        log.info(
                "OTP verified successfully for {} [{}]",
                email,
                purpose
        );
    }


    // =========================================================
    // GENERATE 6 DIGIT OTP
    // =========================================================

    private String generateOtp() {

        int number =
                secureRandom.nextInt(1_000_000);

        return String.format(
                "%06d",
                number
        );
    }


    // =========================================================
    // SEND OTP EMAIL
    // =========================================================

    private void sendOtpEmail(
            String email,
            String otp,
            OtpPurpose purpose
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        if (
                purpose ==
                        OtpPurpose.VERIFY_EMAIL
        ) {

            message.setSubject(
                    "LabResource - Email Verification OTP"
            );

            message.setText(
                    "Your LabResource email verification OTP is: "
                            + otp
                            + "\n\n"
                            + "This OTP will expire in "
                            + OTP_EXPIRY_MINUTES
                            + " minutes."
                            + "\n\n"
                            + "If you did not request this OTP, "
                            + "please ignore this email."
            );

        } else {

            message.setSubject(
                    "LabResource - Password Reset OTP"
            );

            message.setText(
                    "Your LabResource password reset OTP is: "
                            + otp
                            + "\n\n"
                            + "This OTP will expire in "
                            + OTP_EXPIRY_MINUTES
                            + " minutes."
                            + "\n\n"
                            + "If you did not request this OTP, "
                            + "please ignore this email."
            );
        }
        mailSender.send(message);
    }
}