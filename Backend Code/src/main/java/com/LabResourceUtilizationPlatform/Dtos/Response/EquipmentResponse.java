package com.LabResourceUtilizationPlatform.Dtos.Response;


import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentResponse {

    private String equipmentName;
    private String equipmentCode;
    private String model;
    private String description;
    private String specifications;
    private String labCode;
    private String status;
    private String imageUrl;
    private BigDecimal hourlyRate;
    private String lab;
    private String department;
    private String institution;
    private Integer availableQuantity;
    private Integer serviceIntervalDays;
    private LocalDate lastServiceDate;
    private LocalDate nextServiceDate;
    private Long serviceDueInDays;
}
