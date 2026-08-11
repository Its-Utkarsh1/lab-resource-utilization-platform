package com.LabResourceUtilizationPlatform.Kafka.event;

import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingCreatedEvent {

    private Long bookingId;

    private Long userId;

    private String equipmentCode;

    private String title;

    private String message;

    private NotificationType notificationType;

}