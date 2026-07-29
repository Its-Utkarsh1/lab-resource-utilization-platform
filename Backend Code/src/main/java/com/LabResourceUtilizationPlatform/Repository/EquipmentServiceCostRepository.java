package com.LabResourceUtilizationPlatform.Repository;

import com.LabResourceUtilizationPlatform.Dtos.Response.RevenueResponse;
import com.LabResourceUtilizationPlatform.Entity.EquipmentServiceCost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface EquipmentServiceCostRepository extends JpaRepository<EquipmentServiceCost, Long> {

    Optional<EquipmentServiceCost> findByBookingId(Long bookingId);

    @Query("""
            SELECT COALESCE(SUM(e.totalCost),0)
            FROM EquipmentServiceCost e
            """)
    BigDecimal getTotalRevenue();

    @Query("""
            SELECT COALESCE(SUM(e.totalCost),0)
            FROM EquipmentServiceCost e
            WHERE e.equipment.id = :equipmentId
            """)
    BigDecimal getRevenueByEquipment(@Param("equipmentId") Long equipmentId);

    @Query("""
            SELECT COALESCE(SUM(e.totalCost),0)
            FROM EquipmentServiceCost e
            WHERE e.equipment.lab.id = :labId
            """)
    BigDecimal getRevenueByLab(@Param("labId") Long labId);

    @Query("""
            SELECT COALESCE(SUM(e.totalCost),0)
            FROM EquipmentServiceCost e
            WHERE e.equipment.lab.institution.id = :institutionId
            """)
    BigDecimal getRevenueByInstitution(
            @Param("institutionId") Long institutionId
    );

    @Query("""
            SELECT new com.LabResourceUtilizationPlatform.Dtos.Response.RevenueResponse(
                e.equipment.equipmentName,
                null,
                SUM(e.totalCost)
            )
            FROM EquipmentServiceCost e
            GROUP BY e.equipment.id, e.equipment.equipmentName
            ORDER BY SUM(e.totalCost) DESC
            """)
    List<RevenueResponse> findRevenueByEquipment();

    @Query("""
            SELECT new com.LabResourceUtilizationPlatform.Dtos.Response.RevenueResponse(
                null,
                e.equipment.lab.labName,
                SUM(e.totalCost)
            )
            FROM EquipmentServiceCost e
            GROUP BY e.equipment.lab.id, e.equipment.lab.labName
            ORDER BY SUM(e.totalCost) DESC
            """)
    List<RevenueResponse> findRevenueByLab();
}