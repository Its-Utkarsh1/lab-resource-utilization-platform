package com.LabResourceUtilizationPlatform.Kafka.producer;

import com.LabResourceUtilizationPlatform.Dtos.Response.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendNotification(NotificationMessage message) {
        kafkaTemplate.send("notifications", message);
    }
}