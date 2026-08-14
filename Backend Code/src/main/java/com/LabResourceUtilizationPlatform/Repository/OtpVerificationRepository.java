package com.LabResourceUtilizationPlatform.Repository;

import com.LabResourceUtilizationPlatform.Entity.Enum.OtpPurpose;
import com.LabResourceUtilizationPlatform.Entity.OtpVerification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification>
    findTopByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(
            String email,
            OtpPurpose purpose
    );

    void deleteByEmailAndPurpose(
            String email,
            OtpPurpose purpose
    );
}