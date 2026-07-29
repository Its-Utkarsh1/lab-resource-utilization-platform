package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Entity.Booking;
import com.LabResourceUtilizationPlatform.Entity.Equipment;
import com.LabResourceUtilizationPlatform.Entity.EquipmentServiceCost;
import com.LabResourceUtilizationPlatform.Repository.BookingRepository;
import com.LabResourceUtilizationPlatform.Repository.EquipmentServiceCostRepository;
import com.LabResourceUtilizationPlatform.Service.EquipmentServiceCostService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EquipmentServiceCostImpl implements EquipmentServiceCostService {

    private final BookingRepository bookingRepository;
    private final EquipmentServiceCostRepository equipmentServiceCostRepository;

    @Override
    @Transactional
    public EquipmentServiceCost calculateCost(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Booking not found."));

        Equipment equipment = booking.getEquipment();

        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new IllegalArgumentException("Booking start time or end time is missing.");
        }

        if (equipment.getHourlyRate() == null) {
            throw new IllegalArgumentException("Equipment hourly rate is not set.");
        }

        // If cost already exists, update it instead
        EquipmentServiceCost existing = equipmentServiceCostRepository
                .findByBookingId(bookingId)
                .orElse(null);

        if (existing != null) {
            return updateCost(bookingId);
        }

        double hoursUsed = calculateHours(
                booking.getStartTime(),
                booking.getEndTime()
        );

        BigDecimal totalCost = equipment.getHourlyRate()
                .multiply(BigDecimal.valueOf(hoursUsed))
                .multiply(BigDecimal.valueOf(booking.getQuantity()))
                .setScale(2, RoundingMode.HALF_UP);

        EquipmentServiceCost serviceCost = EquipmentServiceCost.builder()
                .booking(booking)
                .equipment(equipment)
                .user(booking.getUser())
                .hourlyRate(equipment.getHourlyRate())
                .quantity(booking.getQuantity())
                .hoursUsed(hoursUsed)
                .totalCost(totalCost)
                .calculatedAt(LocalDateTime.now())
                .build();

        return equipmentServiceCostRepository.save(serviceCost);
    }

    @Override
    @Transactional
    public EquipmentServiceCost updateCost(Long bookingId) {

        EquipmentServiceCost serviceCost = equipmentServiceCostRepository
                .findByBookingId(bookingId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Service cost not found."));

        Booking booking = serviceCost.getBooking();

        double hoursUsed = calculateHours(
                booking.getStartTime(),
                booking.getEndTime()
        );

        BigDecimal totalCost = booking.getEquipment()
                .getHourlyRate()
                .multiply(BigDecimal.valueOf(hoursUsed))
                .multiply(BigDecimal.valueOf(booking.getQuantity()))
                .setScale(2, RoundingMode.HALF_UP);

        serviceCost.setEquipment(booking.getEquipment());
        serviceCost.setUser(booking.getUser());
        serviceCost.setHourlyRate(booking.getEquipment().getHourlyRate());
        serviceCost.setQuantity(booking.getQuantity());
        serviceCost.setHoursUsed(hoursUsed);
        serviceCost.setTotalCost(totalCost);
        serviceCost.setCalculatedAt(LocalDateTime.now());

        return equipmentServiceCostRepository.save(serviceCost);
    }

    private double calculateHours(LocalDateTime start,
                                  LocalDateTime end) {

        long minutes = Duration.between(start, end).toMinutes();

        return minutes / 60.0;
    }
}