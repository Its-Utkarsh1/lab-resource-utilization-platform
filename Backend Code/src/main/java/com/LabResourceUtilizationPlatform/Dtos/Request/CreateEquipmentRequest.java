package com.LabResourceUtilizationPlatform.Dtos.Request;

import com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEquipmentRequest {

    @NotBlank(message = "Equipment name is required.")
    private String equipmentName;

    @NotBlank(message = "Equipment code is required.")
    private String equipmentCode;

    @NotBlank(message = "Manufacturer is required.")
    private String manufacturer;

    @NotBlank(message = "Model is required.")
    private String model;

    private String description;

    private BigDecimal hourlyRate;

    private String specifications;

    private String imageUrl;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    private EquipmentStatus status;

    @NotBlank
    private String institutionCode;

    private Integer serviceIntervalDays;

    private LocalDate lastServiceDate;

    @NotBlank
    private String labCode;
}