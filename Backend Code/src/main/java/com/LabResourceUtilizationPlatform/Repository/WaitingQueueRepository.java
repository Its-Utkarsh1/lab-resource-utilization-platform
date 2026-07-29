package com.LabResourceUtilizationPlatform.Repository;

import com.LabResourceUtilizationPlatform.Dtos.Response.WaitingQueueAnalyticsResponse;
import com.LabResourceUtilizationPlatform.Entity.WaitingQueue;
import com.LabResourceUtilizationPlatform.Entity.Enum.WaitingQueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface WaitingQueueRepository
        extends JpaRepository<WaitingQueue, Long> {

    List<WaitingQueue> findByEquipmentIdAndStatusOrderByCreatedAtAsc(
            Long equipmentId,
            WaitingQueueStatus status
    );

    Optional<WaitingQueue> findFirstByEquipmentIdAndStatusOrderByCreatedAtAsc(
            Long equipmentId,
            WaitingQueueStatus status
    );

    List<WaitingQueue> findByUserId(Long userId);

    @Query("""
       SELECT COUNT(w)
       FROM WaitingQueue w
       WHERE w.status='WAITING'
       """)
    Long getWaitingUsers();
    
    Long countByEquipment_Lab_Institution_IdAndStatus(Long institutionId, WaitingQueueStatus waitingQueueStatus);

    Long countByEquipment_Lab_IdAndStatus(Long labId, WaitingQueueStatus waitingQueueStatus);

    @Query("""
    SELECT new com.LabResourceUtilizationPlatform.Dtos.Response.WaitingQueueAnalyticsResponse(
        w.equipment.equipmentName,
        COUNT(w)
    )
    FROM WaitingQueue w
    WHERE w.status = 'WAITING'
    GROUP BY
        w.equipment.id,
        w.equipment.equipmentName
    ORDER BY COUNT(w) DESC
    """)
    List<WaitingQueueAnalyticsResponse> findWaitingQueueAnalytics();

    @Query("""
SELECT new com.LabResourceUtilizationPlatform.Dtos.Response.WaitingQueueAnalyticsResponse(
    w.equipment.equipmentName,
    COUNT(w)
)
FROM WaitingQueue w
WHERE w.status = com.LabResourceUtilizationPlatform.Entity.Enum.WaitingQueueStatus.WAITING
GROUP BY
    w.equipment.id,
    w.equipment.equipmentName
ORDER BY COUNT(w) DESC
""")
    List<WaitingQueueAnalyticsResponse> getWaitingQueueAnalytics();
}