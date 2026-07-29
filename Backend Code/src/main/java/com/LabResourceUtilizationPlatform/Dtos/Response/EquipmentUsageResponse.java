package com.LabResourceUtilizationPlatform.Dtos.Response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentUsageResponse {

    private String equipmentCode;

    private String equipmentName;

    private Long totalBookings;

    private Long totalHours;

    private Double utilizationPercentage;
}