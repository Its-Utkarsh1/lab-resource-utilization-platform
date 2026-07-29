package com.LabResourceUtilizationPlatform.Dtos.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDashboardResponse {

    private Long totalBookings;

    private Long completedBookings;

    private Long cancelledBookings;

    private Long waitingBookings;

    private Long totalEquipment;

    private Long equipmentInUse;

    private Long availableEquipment;

    private Long maintenanceEquipment;

    private Double utilizationRate;

    private BigDecimal totalRevenue;
}