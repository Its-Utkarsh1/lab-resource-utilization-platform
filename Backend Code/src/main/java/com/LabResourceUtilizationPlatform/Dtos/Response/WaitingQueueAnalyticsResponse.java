package com.LabResourceUtilizationPlatform.Dtos.Response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WaitingQueueAnalyticsResponse {

    private String equipmentName;

    private Long waitingUsers;
}