package com.LabResourceUtilizationPlatform.Dtos.Response;

import com.LabResourceUtilizationPlatform.Entity.Enum.WaitingQueueStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WaitListResponse {

    private Long queueId;

    private String equipmentCode;

    private String equipmentName;

    private Integer position;

    private Integer quantity;

    private WaitingQueueStatus status;

    private LocalDateTime requestedAt;
}