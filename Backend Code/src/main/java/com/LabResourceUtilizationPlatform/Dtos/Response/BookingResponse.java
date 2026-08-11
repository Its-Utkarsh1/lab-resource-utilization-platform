package com.LabResourceUtilizationPlatform.Dtos.Response;

import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String bookingCode;
    private String bookedBy;
    private String equipmentName;
    private String institutionName;
    private String departmentName;
    private String equipmentImage;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private BigDecimal serviceCost;
    private Integer quantity;
    private BookingStatus status;
    private LocalDateTime createdAt;
}
