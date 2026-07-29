package com.LabResourceUtilizationPlatform.Dtos.Response;

import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;

    private String title;

    private String message;

    private NotificationType type;

    private Boolean isRead;

    private LocalDateTime createdAt;
}