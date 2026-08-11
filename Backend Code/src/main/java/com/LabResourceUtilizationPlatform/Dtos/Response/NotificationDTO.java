package com.LabResourceUtilizationPlatform.Dtos.Response;

import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {

    private Long id;

    private NotificationType type;

    private String title;

    private String message;

    private Boolean read;

    private LocalDateTime createdAt;
}