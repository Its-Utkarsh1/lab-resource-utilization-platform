package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateSharingRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.SharingResponse;
import com.LabResourceUtilizationPlatform.Entity.*;
import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import com.LabResourceUtilizationPlatform.Entity.Enum.SharingStatus;
import com.LabResourceUtilizationPlatform.Repository.EquipmentRepository;
import com.LabResourceUtilizationPlatform.Repository.EquipmentSharingRepository;
import com.LabResourceUtilizationPlatform.Repository.InstitutionRepository;
import com.LabResourceUtilizationPlatform.Repository.UserRepository;
import com.LabResourceUtilizationPlatform.Service.EquipmentSharingService;
import com.LabResourceUtilizationPlatform.Service.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EquipmentSharingServiceImpl implements EquipmentSharingService {

    private final EquipmentSharingRepository equipmentSharingRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));
    }

    private SharingResponse mapToResponse(EquipmentSharing sharing) {

        return SharingResponse.builder()
                .id(sharing.getId())
                .sharingCode(sharing.getSharingCode())
                .equipmentCode(sharing.getEquipment().getEquipmentCode())
                .equipmentName(sharing.getEquipment().getEquipmentName())
                .ownerInstitution(sharing.getOwnerInstitution().getName())
                .requestInstitution(sharing.getRequestInstitution().getName())
                .requestedBy(sharing.getRequestedBy().getFullName())
                .approvedBy(
                        sharing.getApprovedBy() != null
                                ? sharing.getApprovedBy().getFullName()
                                : null
                )
                .quantity(sharing.getQuantity())
                .purpose(sharing.getPurpose())
                .startDate(sharing.getStartDate())
                .endDate(sharing.getEndDate())
                .status(sharing.getStatus())
                .remarks(sharing.getRemarks())
                .createdAt(sharing.getCreatedAt())
                .updatedAt(sharing.getUpdatedAt())
                .build();
    }
    @Override
    public SharingResponse requestEquipment(CreateSharingRequest request) {

        User loggedInUser = getLoggedInUser();

        Equipment equipment = equipmentRepository
                .findByEquipmentCode(request.getEquipmentCode())
                .orElseThrow(() ->
                        new EntityNotFoundException("Equipment not found."));

        // Prevent requesting equipment from the same institution
        if (equipment.getLab()
                .getInstitution()
                .getId()
                .equals(loggedInUser.getInstitution().getId())) {

            throw new IllegalArgumentException(
                    "You cannot request equipment from your own institution."
            );
        }

        String sharingCode = "SH-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 8)
                        .toUpperCase();

        EquipmentSharing sharing = EquipmentSharing.builder()
                .sharingCode(sharingCode)
                .equipment(equipment)
                .ownerInstitution(equipment.getLab().getInstitution())
                .requestInstitution(loggedInUser.getInstitution())
                .requestedBy(loggedInUser)
                .quantity(request.getQuantity())
                .purpose(request.getPurpose())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(SharingStatus.PENDING)
                .remarks(request.getRemarks())
                .build();

        equipmentSharingRepository.save(sharing);
        notificationService.notifyUser(
                equipment.getLab().getLabManager(),
                "New Sharing Request",
                loggedInUser.getInstitution().getName()
                        + " has requested "
                        + equipment.getEquipmentName() + ".",
                NotificationType.SHARING
        );

        return mapToResponse(sharing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SharingResponse> getAvailableEquipment() {

        User loggedInUser = getLoggedInUser();

        Long institutionId = loggedInUser.getInstitution().getId();

        return equipmentRepository
                .findAvailableForSharing(institutionId)
                .stream()
                .map(equipment -> SharingResponse.builder()
                        .equipmentCode(equipment.getEquipmentCode())
                        .equipmentName(equipment.getEquipmentName())
                        .ownerInstitution(equipment.getLab().getInstitution().getName())
                        .quantity(equipment.getQuantity())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SharingResponse> getIncomingRequests() {

        User loggedInUser = getLoggedInUser();

        Long institutionId = loggedInUser.getInstitution().getId();

        return equipmentSharingRepository
                .findByOwnerInstitutionId(institutionId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    @Transactional(readOnly = true)
    public List<SharingResponse> getOutgoingRequests() {

        User loggedInUser = getLoggedInUser();

        return equipmentSharingRepository
                .findByRequestInstitutionIdAndStatus(
                        loggedInUser.getInstitution().getId(),
                        SharingStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public SharingResponse approveRequest(String sharingCode) {

        User loggedInUser = getLoggedInUser();

        EquipmentSharing sharing = equipmentSharingRepository
                .findBySharingCode(sharingCode)
                .orElseThrow(() ->
                        new EntityNotFoundException("Sharing request not found."));

        // Only owner institution can approve
        if (!sharing.getOwnerInstitution().getId()
                .equals(loggedInUser.getInstitution().getId())) {

            throw new RuntimeException(
                    "You are not authorized to approve this request."
            );
        }

        if (sharing.getStatus() != SharingStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending requests can be approved."
            );
        }

        // Check available quantity
        if (sharing.getEquipment().getQuantity() < sharing.getQuantity()) {
            throw new RuntimeException(
                    "Requested quantity is not available."
            );
        }

        sharing.getEquipment().setQuantity(
                sharing.getEquipment().getQuantity()
                        - sharing.getQuantity()
        );

        equipmentRepository.save(sharing.getEquipment());

        sharing.setApprovedBy(loggedInUser);
        sharing.setStatus(SharingStatus.APPROVED);

        equipmentSharingRepository.save(sharing);

        notificationService.notifyUser(
                sharing.getRequestedBy(),
                "Sharing Request Approved",
                "Your request for "
                        + sharing.getEquipment().getEquipmentName()
                        + " has been approved.",
                NotificationType.SHARING
        );

        return mapToResponse(sharing);
    }

    @Override
    public SharingResponse rejectRequest(String sharingCode) {

        User loggedInUser = getLoggedInUser();

        EquipmentSharing sharing = equipmentSharingRepository
                .findBySharingCode(sharingCode)
                .orElseThrow(() ->
                        new EntityNotFoundException("Sharing request not found."));

        // Only owner institution can reject
        if (!sharing.getOwnerInstitution().getId()
                .equals(loggedInUser.getInstitution().getId())) {

            throw new RuntimeException(
                    "You are not authorized to reject this request."
            );
        }

        // Only pending requests can be rejected
        if (sharing.getStatus() != SharingStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending requests can be rejected."
            );
        }

        sharing.setApprovedBy(loggedInUser);
        sharing.setStatus(SharingStatus.REJECTED);

        equipmentSharingRepository.save(sharing);

        notificationService.notifyUser(
                sharing.getRequestedBy(),
                "Sharing Request Rejected",
                "Your request for "
                        + sharing.getEquipment().getEquipmentName()
                        + " has been rejected.",
                NotificationType.SHARING
        );

        return mapToResponse(sharing);
    }

    @Override
    public SharingResponse startSharing(String sharingCode) {

        User loggedInUser = getLoggedInUser();

        EquipmentSharing sharing = equipmentSharingRepository
                .findBySharingCode(sharingCode)
                .orElseThrow(() ->
                        new EntityNotFoundException("Sharing request not found."));

        // Only owner institution can start sharing
        if (!sharing.getOwnerInstitution().getId()
                .equals(loggedInUser.getInstitution().getId())) {

            throw new RuntimeException(
                    "You are not authorized to start this sharing."
            );
        }

        // Only approved requests can become active
        if (sharing.getStatus() != SharingStatus.APPROVED) {
            throw new RuntimeException(
                    "Only approved requests can be started."
            );
        }

        sharing.setStatus(SharingStatus.ACTIVE);

        equipmentSharingRepository.save(sharing);

        notificationService.notifyUser(
                sharing.getRequestedBy(),
                "Equipment Sharing Started",
                "Equipment "
                        + sharing.getEquipment().getEquipmentName()
                        + " is now ready for sharing.",
                NotificationType.SHARING
        );

        return mapToResponse(sharing);
    }

    @Override
    public SharingResponse completeSharing(String sharingCode) {

        User loggedInUser = getLoggedInUser();

        EquipmentSharing sharing = equipmentSharingRepository
                .findBySharingCode(sharingCode)
                .orElseThrow(() ->
                        new EntityNotFoundException("Sharing request not found."));

        // Only owner institution can complete sharing
        if (!sharing.getOwnerInstitution().getId()
                .equals(loggedInUser.getInstitution().getId())) {

            throw new RuntimeException(
                    "You are not authorized to complete this sharing."
            );
        }

        // Only ACTIVE sharing can be completed
        if (sharing.getStatus() != SharingStatus.ACTIVE) {
            throw new RuntimeException(
                    "Only active sharing can be completed."
            );
        }

        Equipment equipment = sharing.getEquipment();

        // Return the shared quantity
        equipment.setQuantity(
                equipment.getQuantity() + sharing.getQuantity()
        );

        equipmentRepository.save(equipment);

        sharing.setStatus(SharingStatus.COMPLETED);

        equipmentSharingRepository.save(sharing);

        notificationService.notifyUser(
                sharing.getRequestedBy(),
                "Sharing Completed",
                "Equipment sharing has been completed.",
                NotificationType.SHARING
        );

        notificationService.notifyUser(
                sharing.getApprovedBy(),
                "Equipment Returned",
                sharing.getEquipment().getEquipmentName()
                        + " has been returned successfully.",
                NotificationType.SHARING
        );

        return mapToResponse(sharing);
    }

    @Override
    public SharingResponse cancelSharing(String sharingCode) {

        User loggedInUser = getLoggedInUser();

        EquipmentSharing sharing = equipmentSharingRepository
                .findBySharingCode(sharingCode)
                .orElseThrow(() ->
                        new EntityNotFoundException("Sharing request not found."));

        // Only requesting institution can cancel
        if (!sharing.getRequestInstitution().getId()
                .equals(loggedInUser.getInstitution().getId())) {

            throw new RuntimeException(
                    "You are not authorized to cancel this sharing request."
            );
        }

        // Can cancel only if still pending
        if (sharing.getStatus() != SharingStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending requests can be cancelled."
            );
        }

        sharing.setStatus(SharingStatus.CANCELLED);

        equipmentSharingRepository.save(sharing);

        notificationService.notifyUser(
                sharing.getEquipment().getLab().getLabManager(),
                "Sharing Request Cancelled",
                "The sharing request for "
                        + sharing.getEquipment().getEquipmentName()
                        + " has been cancelled.",
                NotificationType.SHARING
        );

        return mapToResponse(sharing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SharingResponse> getSharingHistory() {

        User loggedInUser = getLoggedInUser();

        return equipmentSharingRepository
                .findSharingHistory(loggedInUser.getInstitution().getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SharingResponse getSharingByCode(String sharingCode) {

        User loggedInUser = getLoggedInUser();

        EquipmentSharing sharing = equipmentSharingRepository
                .findBySharingCode(sharingCode)
                .orElseThrow(() ->
                        new EntityNotFoundException("Sharing request not found."));

        // Only owner institution or requesting institution can view
        if (!sharing.getOwnerInstitution().getId().equals(loggedInUser.getInstitution().getId())
                && !sharing.getRequestInstitution().getId().equals(loggedInUser.getInstitution().getId())) {

            throw new RuntimeException(
                    "You are not authorized to view this sharing request."
            );
        }

        return mapToResponse(sharing);
    }

}