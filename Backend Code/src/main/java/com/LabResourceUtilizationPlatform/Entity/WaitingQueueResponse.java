package com.LabResourceUtilizationPlatform.Dtos.Response;

import com.LabResourceUtilizationPlatform.Entity.Enum.WaitingQueueStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WaitingQueueResponse {

    private Long id;

    private String equipmentCode;
    private String equipmentName;

    private String userName;
    private String email;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer quantity;

    private String purpose;

    private WaitingQueueStatus status;

    private Integer position;

    private LocalDateTime createdAt;
}