package com.LabResourceUtilizationPlatform.Dtos.Response;

import com.LabResourceUtilizationPlatform.Entity.Enum.SharingStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SharingResponse {

    private Long id;

    private String sharingCode;

    // Equipment
    private String equipmentCode;
    private String equipmentName;

    // Institutions
    private String ownerInstitution;
    private String requestInstitution;

    // Users
    private String requestedBy;
    private String approvedBy;

    // Sharing Details
    private Integer quantity;
    private String purpose;

    private LocalDate startDate;
    private LocalDate endDate;

    private SharingStatus status;

    private String remarks;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}