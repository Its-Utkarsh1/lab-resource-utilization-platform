package com.LabResourceUtilizationPlatform.Service;


import com.LabResourceUtilizationPlatform.Entity.Enum.OtpPurpose;

public interface OtpService {

    void generateAndSendOtp(
            String email,
            OtpPurpose purpose
    );

    void verifyOtp(
            String email,
            String otp,
            OtpPurpose purpose
    );
}