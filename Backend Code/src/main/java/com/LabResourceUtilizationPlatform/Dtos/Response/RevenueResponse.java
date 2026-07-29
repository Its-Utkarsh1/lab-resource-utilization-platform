package com.LabResourceUtilizationPlatform.Dtos.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueResponse {

    private String equipmentName;
    private String labName;
    private BigDecimal revenue;
}