package com.LabResourceUtilizationPlatform.Repository;

import com.LabResourceUtilizationPlatform.Entity.EquipmentSharing;
import com.LabResourceUtilizationPlatform.Entity.Enum.SharingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentSharingRepository extends JpaRepository<EquipmentSharing, Long> {

    Optional<EquipmentSharing> findBySharingCode(String sharingCode);

    boolean existsBySharingCode(String sharingCode);

    List<EquipmentSharing> findByOwnerInstitutionId(Long institutionId);

    List<EquipmentSharing> findByRequestInstitutionId(Long institutionId);

    List<EquipmentSharing> findByRequestedById(Long userId);

    List<EquipmentSharing> findByStatus(SharingStatus status);

    List<EquipmentSharing> findByOwnerInstitutionIdAndStatus(
            Long institutionId,
            SharingStatus status
    );

    List<EquipmentSharing> findByRequestInstitutionIdAndStatus(
            Long institutionId,
            SharingStatus status
    );

    List<EquipmentSharing> findByEquipmentId(Long equipmentId);

    long countByStatus(SharingStatus status);

    long countByOwnerInstitutionId(Long institutionId);

    long countByRequestInstitutionId(Long institutionId);

    @Query("""
SELECT e
FROM EquipmentSharing e
WHERE
(
    e.ownerInstitution.id = :institutionId
    OR
    e.requestInstitution.id = :institutionId
)
AND
e.status IN (
    com.LabResourceUtilizationPlatform.Entity.Enum.SharingStatus.COMPLETED,
    com.LabResourceUtilizationPlatform.Entity.Enum.SharingStatus.REJECTED,
    com.LabResourceUtilizationPlatform.Entity.Enum.SharingStatus.CANCELLED
)
ORDER BY e.updatedAt DESC
""")
    List<EquipmentSharing> findSharingHistory(
            @Param("institutionId") Long institutionId
    );
}