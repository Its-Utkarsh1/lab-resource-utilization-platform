package com.LabResourceUtilizationPlatform.Dtos.Response;

import com.LabResourceUtilizationPlatform.Entity.Enum.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {

    private Long invoiceId;

    private String bookingCode;

    private String institutionName;

    private String userName;

    private String equipmentName;

    private Integer quantity;

    private Double hoursUsed;

    private BigDecimal hourlyRate;

    private BigDecimal amount;

    private PaymentStatus paymentStatus;

    private LocalDateTime invoiceDate;
}