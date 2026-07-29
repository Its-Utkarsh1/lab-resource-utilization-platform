package com.LabResourceUtilizationPlatform.Dtos.Request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSharingRequest {

    @NotBlank(message = "Equipment code is required.")
    private String equipmentCode;

    @NotNull(message = "Quantity is required.")
    @Min(value = 1, message = "Quantity must be at least 1.")
    private Integer quantity;

    @NotBlank(message = "Purpose is required.")
    private String purpose;

    @NotNull(message = "Start date is required.")
    @Future(message = "Start date must be in the future.")
    private LocalDate startDate;

    @NotNull(message = "End date is required.")
    @Future(message = "End date must be in the future.")
    private LocalDate endDate;

    private String remarks;
}