package com.LabResourceUtilizationPlatform.Entity;

import com.LabResourceUtilizationPlatform.Entity.Enum.OtpPurpose;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "otp_verifications",
        indexes = {
                @Index(
                        name = "idx_otp_email_purpose",
                        columnList = "email,purpose"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 255
    )
    private String email;

    @Column(
            nullable = false,
            length = 255
    )
    private String otpHash;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private OtpPurpose purpose;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used;

    @Column(nullable = false)
    private int attempts;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}