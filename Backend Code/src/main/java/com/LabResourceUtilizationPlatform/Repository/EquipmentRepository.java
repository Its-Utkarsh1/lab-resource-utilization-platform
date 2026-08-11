package com.LabResourceUtilizationPlatform.Repository;

import com.LabResourceUtilizationPlatform.Entity.Department;
import com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus;
import com.LabResourceUtilizationPlatform.Entity.Equipment;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import com.LabResourceUtilizationPlatform.Entity.Lab;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findByEquipmentCodeAndLab(
            String equipmentCode,
            Lab lab);

    @Query("""
    SELECT e
    FROM Equipment e
    WHERE e.active = true
      AND e.status = com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus.AVAILABLE
      AND e.lab.department.name = :departmentName
      AND e.lab.department.institution.code = :institutionCode
""")
    List<Equipment> findAvailableEquipment(
            @Param("institutionCode") String institutionCode,
            @Param("departmentName") String departmentName
    );

    Optional<Equipment> findByEquipmentCodeAndLab_LabCodeAndLab_Institution_CodeAndActiveTrue(
            String equipmentCode,
            String labCode,
            String institutionCode
    );

    List<Equipment> findByLab_LabCodeAndLab_Institution_CodeAndActiveTrue(
            String labCode,
            String institutionCode);

    boolean existsByEquipmentCodeAndLab(
            String equipmentCode,
            Lab lab);

    boolean existsByEquipmentNameAndLab(
            String equipmentName,
            Lab lab);

    List<Equipment> findByLab_Institution_CodeAndActiveTrue(
            String institutionCode);

    long countByLab_Department_IdAndStatusAndActiveTrue(
            Long departmentId,
            EquipmentStatus status
    );

    Long countByStatusAndActiveTrue(
            EquipmentStatus equipmentStatus
    );

    Long countByLab_Department_IdAndActiveTrue(Long id);

    Long countByLab_Institution_IdAndActiveTrue(
            Long institutionId
    );

    long countByLabIdAndActiveTrue(
            Long labId
    );


    long countByLabIdAndStatusAndActiveTrue(
            Long labId,
            EquipmentStatus status
    );

    Optional<Equipment> findByEquipmentCodeAndLab_LabManager_IdAndActiveTrue(
            String equipmentCode,
            Long labManagerId
    );


    List<Equipment> findByLab_Department_NameAndLab_Department_Institution_CodeAndActiveTrue(
            String departmentName,
            String institutionCode);

    Optional<Equipment> findByEquipmentCodeAndActiveTrue(
            @NotBlank String equipmentCode);

    @Query("""
    SELECT COUNT(e)
    FROM Equipment e
    WHERE e.active = true
    """)
    Long getTotalEquipment();

    @Query("""
    SELECT COUNT(e)
    FROM Equipment e
    WHERE e.active = true
    AND e.status = com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus.AVAILABLE
    """)
    Long getAvailableEquipment();

    @Query("""
    SELECT COUNT(e)
    FROM Equipment e
    WHERE e.active = true
    AND e.status = com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus.UNDER_MAINTENANCE
    """)
    Long getMaintenanceEquipment();


    @Query("""
    SELECT e
    FROM Equipment e
    WHERE e.active = true
    AND e.lab.institution.id <> :institutionId
    AND e.status = com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus.AVAILABLE
    """)
    List<Equipment> findAvailableForSharing(
            @Param("institutionId") Long institutionId
    );

    Long countByLab_Institution_IdAndStatusAndActiveTrue(Long institutionId, EquipmentStatus equipmentStatus);

    @Query("""
    SELECT e
    FROM Equipment e
    WHERE e.active = true
      AND e.lab.department.institution.id <> :institutionId
      AND e.status = com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus.AVAILABLE
""")
    List<Equipment> findAvailableForSharingExceptInstitution(
            @Param("institutionId") Long institutionId
    );}