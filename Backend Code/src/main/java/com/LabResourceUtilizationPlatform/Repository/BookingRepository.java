package com.LabResourceUtilizationPlatform.Repository;

import com.LabResourceUtilizationPlatform.Dtos.Response.BookingTrendResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.EquipmentUsageResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.MonthlyBookingResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.TopEquipmentResponse;
import com.LabResourceUtilizationPlatform.Entity.Booking;
import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import com.LabResourceUtilizationPlatform.Entity.Lab;
import com.LabResourceUtilizationPlatform.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingCode(String bookingCode);

    boolean existsByBookingCode(String bookingCode);

    List<Booking> findByUser(User user);

    List<Booking> findByStartTimeBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<Booking> findByUserIdAndStartTimeBetween(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
            SELECT b
            FROM Booking b
            WHERE b.user.id = :userId
            AND b.startTime BETWEEN :start AND :end
            """)
    List<Booking> findFacultyBookings(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            SELECT b
            FROM Booking b
            WHERE b.equipment.lab.department.id = :departmentId
            AND b.startTime BETWEEN :start AND :end
            """)
    List<Booking> findDepartmentBookings(
            @Param("departmentId") Long departmentId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            SELECT b
            FROM Booking b
            WHERE b.equipment.lab.institution.id = :institutionId
            AND b.startTime BETWEEN :start AND :end
            """)
    List<Booking> findInstitutionBookings(
            @Param("institutionId") Long institutionId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    /**
     * Total booked quantity for an equipment
     * (ignores booking time)
     */
    @Query("""
            SELECT COALESCE(SUM(b.quantity), 0)
            FROM Booking b
            WHERE b.equipment.id = :equipmentId
            AND b.status IN :statuses
            """)
    Integer getBookedQuantity(
            @Param("equipmentId") Long equipmentId,
            @Param("statuses") List<BookingStatus> statuses
    );

    /**
     * Total booked quantity during a particular time slot.
     * Used while creating a booking.
     */
    @Query("""
            SELECT COALESCE(SUM(b.quantity), 0)
            FROM Booking b
            WHERE b.equipment.id = :equipmentId
            AND b.status IN :statuses
            AND b.startTime < :endTime
            AND b.endTime > :startTime
            """)
    Integer getBookedQuantityForTimeSlot(
            @Param("equipmentId") Long equipmentId,
            @Param("statuses") List<BookingStatus> statuses,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    /**
     * Same as above but ignores the current booking.
     * Used while updating a booking.
     */
    @Query("""
            SELECT COALESCE(SUM(b.quantity), 0)
            FROM Booking b
            WHERE b.equipment.id = :equipmentId
            AND b.status IN :statuses
            AND b.startTime < :endTime
            AND b.endTime > :startTime
            AND b.id <> :bookingId
            """)
    Integer getBookedQuantityForTimeSlotExcludingBooking(
            @Param("equipmentId") Long equipmentId,
            @Param("statuses") List<BookingStatus> statuses,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("bookingId") Long bookingId
    );

    long countByUserId(Long userId);

    long countByUserIdAndStatus(
            Long userId,
            BookingStatus status
    );

    long countByEquipment_Lab_Department_Id(Long departmentId);

    long countByEquipment_Lab_Department_IdAndStatus(
            Long departmentId,
            BookingStatus status
    );

    @Query("""
        SELECT b
        FROM Booking b
        WHERE b.equipment.lab.department.id = :departmentId
        ORDER BY b.createdAt DESC
        """)
    List<Booking> findTop5DepartmentBookings(
            @Param("departmentId") Long departmentId,
            Pageable pageable
    );

    @Query("""
    SELECT b
    FROM Booking b
    WHERE b.user.id = :userId
    ORDER BY b.createdAt DESC
    """)
    List<Booking> findTop5UserBookings(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query("""
    SELECT COUNT(b)
    FROM Booking b
    WHERE b.equipment.lab.institution.id = :institutionId
    """)
    Long countByInstitutionId(@Param("institutionId") Long institutionId);

    long countByEquipment_Lab_IdAndStatus(
            Long labId,
            BookingStatus status
    );

    @Query("""
    SELECT COUNT(b)
    FROM Booking b
    WHERE b.equipment.lab.id = :labId
    AND b.status = :status
    AND FUNCTION('DATE', b.createdAt) = :date
    """)
    long countApprovedToday(
            @Param("labId") Long labId,
            @Param("status") BookingStatus status,
            @Param("date") LocalDate date
    );
    List<Booking> findByEquipment_Lab_LabManager_IdAndStatus(
            Long labManagerId,
            BookingStatus status
    );

    @Query("""
       SELECT COUNT(b)
       FROM Booking b
       """)
    Long getTotalBookings();

    @Query("""
       SELECT COUNT(b)
       FROM Booking b
       WHERE b.status='COMPLETED'
       """)
    Long getCompletedBookings();

    @Query("""
       SELECT COUNT(b)
       FROM Booking b
       WHERE b.status='CANCELLED'
       """)
    Long getCancelledBookings();

    @Query("""
       SELECT COUNT(b)
       FROM Booking b
       WHERE b.status='CONFIRMED'
       """)
    Long getConfirmedBookings();

    Long countByEquipment_Lab_Id(Long labId);

    Long countByEquipment_Lab_Institution_Id(Long institutionId);

    Long countByEquipment_Lab_Institution_IdAndStatus(
            Long institutionId,
            BookingStatus status
    );

    @Query(value = """
SELECT
    DATE(start_time) AS bookingDate,
    COUNT(*) AS bookingCount
FROM bookings
GROUP BY DATE(start_time)
ORDER BY DATE(start_time)
""", nativeQuery = true)
    List<Object[]> findBookingTrend();

    @Query(value = """
SELECT
    TO_CHAR(start_time, 'YYYY-MM') AS month,
    COUNT(*) AS total
FROM bookings
GROUP BY TO_CHAR(start_time, 'YYYY-MM')
ORDER BY TO_CHAR(start_time, 'YYYY-MM')
""", nativeQuery = true)
    List<Object[]> findMonthlyBookings();

    @Query("""
SELECT new com.LabResourceUtilizationPlatform.Dtos.Response.TopEquipmentResponse(
    b.equipment.equipmentName,
    COUNT(b),
    NULL
)
FROM Booking b
GROUP BY b.equipment.id, b.equipment.equipmentName
ORDER BY COUNT(b) ASC
""")
    List<TopEquipmentResponse> findLeastUsedEquipment();

    @Query("""
SELECT new com.LabResourceUtilizationPlatform.Dtos.Response.TopEquipmentResponse(
    b.equipment.equipmentName,
    COUNT(b),
    NULL
)
FROM Booking b
GROUP BY b.equipment.id, b.equipment.equipmentName
ORDER BY COUNT(b) DESC
""")
    List<TopEquipmentResponse> findTopUsedEquipment();

    @Query("""
SELECT new com.LabResourceUtilizationPlatform.Dtos.Response.EquipmentUsageResponse(
    b.equipment.equipmentCode,
    b.equipment.equipmentName,
    COUNT(b),
    0L,
    0.0
)
FROM Booking b
WHERE b.status IN ('CONFIRMED','COMPLETED')
GROUP BY
    b.equipment.id,
    b.equipment.equipmentCode,
    b.equipment.equipmentName
ORDER BY COUNT(b) DESC
""")
    List<EquipmentUsageResponse> findEquipmentUsage();

    List<Booking> findByStatusAndEndTimeBefore(
            BookingStatus status,
            LocalDateTime time
    );

    List<Booking> findByStatusAndEndTimeLessThanEqual(
            BookingStatus status,
            LocalDateTime endTime
    );

    List<Booking> findByStatus(BookingStatus bookingStatus);
}