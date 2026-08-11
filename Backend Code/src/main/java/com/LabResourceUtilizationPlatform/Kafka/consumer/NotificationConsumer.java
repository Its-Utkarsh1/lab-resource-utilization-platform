package com.LabResourceUtilizationPlatform.Kafka.consumer;

import com.LabResourceUtilizationPlatform.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "notifications",
            groupId = "notification-group"
    )
    public void consume(com.LabResourceUtilizationPlatform.Dtos.Response.NotificationMessage message) {

        notificationService.createNotification(
                message.getUserId(),
                message.getType(),
                message.getTitle(),
                message.getMessage()
        );

        System.out.println("Notification received: " + message.getTitle());
    }
}