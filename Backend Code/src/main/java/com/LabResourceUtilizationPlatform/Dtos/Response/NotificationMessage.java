package com.LabResourceUtilizationPlatform.Dtos.Response;

import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {

    private Long userId;

    private NotificationType type;

    private String title;

    private String message;
}