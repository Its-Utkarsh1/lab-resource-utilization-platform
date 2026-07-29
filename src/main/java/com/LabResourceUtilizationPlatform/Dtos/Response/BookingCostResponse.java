package com.LabResourceUtilizationPlatform.Dtos.Response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCostResponse {

    private Long hoursUsed;

    private BigDecimal hourlyRate;

    private Integer quantity;

    private BigDecimal totalAmount;
}