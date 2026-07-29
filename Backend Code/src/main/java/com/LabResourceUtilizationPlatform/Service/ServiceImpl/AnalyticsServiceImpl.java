package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Response.*;
import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus;
import com.LabResourceUtilizationPlatform.Entity.Enum.WaitingQueueStatus;
import com.LabResourceUtilizationPlatform.Entity.Lab;
import com.LabResourceUtilizationPlatform.Entity.User;
import com.LabResourceUtilizationPlatform.Repository.*;
import com.LabResourceUtilizationPlatform.Service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final BookingRepository bookingRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentServiceCostRepository equipmentServiceCostRepository;
    private final WaitingQueueRepository waitingQueueRepository;
    private final LabRepository labRepository;
    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;

    @Override
    public AnalyticsDashboardResponse getSystemAnalytics() {

        Long totalBookings = bookingRepository.getTotalBookings();

        Long completedBookings = bookingRepository.getCompletedBookings();

        Long cancelledBookings = bookingRepository.getCancelledBookings();

        Long waitingBookings = waitingQueueRepository.getWaitingUsers();

        Long totalEquipment = equipmentRepository.getTotalEquipment();

        Long availableEquipment = equipmentRepository.getAvailableEquipment();

        Long maintenanceEquipment = equipmentRepository.getMaintenanceEquipment();

        Long equipmentInUse = bookingRepository.getConfirmedBookings();

        BigDecimal totalRevenue = equipmentServiceCostRepository.getTotalRevenue();

        double utilizationRate = totalEquipment == 0
                ? 0
                : (equipmentInUse.doubleValue() * 100) / totalEquipment;

        return AnalyticsDashboardResponse.builder()
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .waitingBookings(waitingBookings)
                .totalEquipment(totalEquipment)
                .equipmentInUse(equipmentInUse)
                .availableEquipment(availableEquipment)
                .maintenanceEquipment(maintenanceEquipment)
                .utilizationRate(utilizationRate)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    public AnalyticsDashboardResponse getInstitutionAnalytics() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        Long institutionId = user.getInstitution().getId();

        Long totalEquipment =
                equipmentRepository.countByLab_Institution_Id(institutionId);

        Long availableEquipment =
                equipmentRepository.countByLab_Institution_IdAndStatus(
                        institutionId,
                        EquipmentStatus.AVAILABLE
                );

        Long maintenanceEquipment =
                equipmentRepository.countByLab_Institution_IdAndStatus(
                        institutionId,
                        EquipmentStatus.UNDER_MAINTENANCE
                );

        Long equipmentInUse =
                bookingRepository.countByEquipment_Lab_Institution_IdAndStatus(
                        institutionId,
                        BookingStatus.CONFIRMED
                );

        Long totalBookings =
                bookingRepository.countByEquipment_Lab_Institution_Id(
                        institutionId
                );

        Long completedBookings =
                bookingRepository.countByEquipment_Lab_Institution_IdAndStatus(
                        institutionId,
                        BookingStatus.COMPLETED
                );

        Long cancelledBookings =
                bookingRepository.countByEquipment_Lab_Institution_IdAndStatus(
                        institutionId,
                        BookingStatus.CANCELLED
                );

        Long waitingBookings =
                waitingQueueRepository.countByEquipment_Lab_Institution_IdAndStatus(
                        institutionId,
                        WaitingQueueStatus.WAITING
                );

        BigDecimal totalRevenue =
                equipmentServiceCostRepository.getRevenueByInstitution(
                        institutionId
                );

        double utilizationRate =
                totalEquipment == 0
                        ? 0
                        : (equipmentInUse.doubleValue() * 100) / totalEquipment;

        return AnalyticsDashboardResponse.builder()
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .waitingBookings(waitingBookings)
                .totalEquipment(totalEquipment)
                .equipmentInUse(equipmentInUse)
                .availableEquipment(availableEquipment)
                .maintenanceEquipment(maintenanceEquipment)
                .utilizationRate(utilizationRate)
                .totalRevenue(totalRevenue)
                .build();
    }
    @Override
    public AnalyticsDashboardResponse getLabAnalytics() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        System.out.println("Authenticated User: " + authentication.getName());
        System.out.println("Principal = " + authentication.getPrincipal());


        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found."));

        System.out.println("Searching = " + authentication.getName());

        System.out.println("Exists = " +
                userRepository.existsByEmail(authentication.getName()));

        System.out.println("Total Users = " +
                userRepository.count());

        System.out.println(userRepository.findAll()
                .stream()
                .map(User::getEmail)
                .toList());

        Lab lab = labRepository.findByLabManagerId(user.getId())
                .orElseThrow(() -> new RuntimeException("No lab assigned."));

        Long labId = lab.getId();

        Long totalEquipment = equipmentRepository.countByLabId(labId);

        Long availableEquipment =
                equipmentRepository.countByLabIdAndStatus(
                        labId,
                        EquipmentStatus.AVAILABLE
                );

        Long maintenanceEquipment =
                equipmentRepository.countByLabIdAndStatus(
                        labId,
                        EquipmentStatus.UNDER_MAINTENANCE
                );

        Long equipmentInUse =
                bookingRepository.countByEquipment_Lab_IdAndStatus(
                        labId,
                        BookingStatus.CONFIRMED
                );

        Long totalBookings =
                bookingRepository.countByEquipment_Lab_Id(labId);

        Long completedBookings =
                bookingRepository.countByEquipment_Lab_IdAndStatus(
                        labId,
                        BookingStatus.COMPLETED
                );

        Long cancelledBookings =
                bookingRepository.countByEquipment_Lab_IdAndStatus(
                        labId,
                        BookingStatus.CANCELLED
                );

        Long waitingBookings =
                waitingQueueRepository.countByEquipment_Lab_IdAndStatus(
                        labId,
                        WaitingQueueStatus.WAITING
                );

        BigDecimal totalRevenue =
                equipmentServiceCostRepository.getRevenueByLab(labId);

        double utilizationRate =
                totalEquipment == 0
                        ? 0
                        : (equipmentInUse.doubleValue() * 100) / totalEquipment;

        return AnalyticsDashboardResponse.builder()
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .waitingBookings(waitingBookings)
                .totalEquipment(totalEquipment)
                .equipmentInUse(equipmentInUse)
                .availableEquipment(availableEquipment)
                .maintenanceEquipment(maintenanceEquipment)
                .utilizationRate(utilizationRate)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    public List<RevenueResponse> getRevenueByEquipment() {
        return equipmentServiceCostRepository.findRevenueByEquipment();
    }

    @Override
    public List<RevenueResponse> getRevenueByLab() {
        return equipmentServiceCostRepository.findRevenueByLab();
    }

    @Override
    public List<EquipmentUsageResponse> getEquipmentUsage() {
        return bookingRepository.findEquipmentUsage();
    }

    @Override
    public List<TopEquipmentResponse> getTopUsedEquipment() {
        return bookingRepository.findTopUsedEquipment();
    }

    @Override
    public List<TopEquipmentResponse> getLeastUsedEquipment() {
        return bookingRepository.findLeastUsedEquipment();
    }

    @Override
    public List<MonthlyBookingResponse> getMonthlyBookings() {

        return bookingRepository.findMonthlyBookings()
                .stream()
                .map(row -> MonthlyBookingResponse.builder()
                        .month((String) row[0])
                        .totalBookings(((Number) row[1]).longValue())
                        .build())
                .toList();
    }

    @Override
    public List<BookingTrendResponse> getBookingTrend() {

        return bookingRepository.findBookingTrend()
                .stream()
                .map(row -> new BookingTrendResponse(
                        row[0].toString(),
                        ((Number) row[1]).longValue()
                ))
                .toList();
    }

    @Override
    public List<WaitingQueueAnalyticsResponse> getWaitingQueueAnalytics() {
        return waitingQueueRepository.getWaitingQueueAnalytics();
    }
}