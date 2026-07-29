package com.LabResourceUtilizationPlatform.Dtos.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopEquipmentResponse {

    private String equipmentName;

    private Long bookingCount;

    private BigDecimal revenue;
}