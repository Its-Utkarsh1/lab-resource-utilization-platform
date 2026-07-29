package com.LabResourceUtilizationPlatform.Entity;

import com.LabResourceUtilizationPlatform.Entity.Enum.SharingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "equipment_sharing")
public class EquipmentSharing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sharingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_institution_id", nullable = false)
    private Institution ownerInstitution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_institution_id", nullable = false)
    private Institution requestInstitution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 500)
    private String purpose;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SharingStatus status;

    @Column(length = 500)
    private String remarks;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}