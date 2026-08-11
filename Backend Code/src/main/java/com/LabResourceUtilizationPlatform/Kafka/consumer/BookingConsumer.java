package com.LabResourceUtilizationPlatform.Kafka.consumer;

import com.LabResourceUtilizationPlatform.Kafka.event.BookingCreatedEvent;
import com.LabResourceUtilizationPlatform.Kafka.producer.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingConsumer {

    private final NotificationProducer notificationProducer;

    @KafkaListener(
            topics = "booking-created",
            groupId = "lab-group"
    )
    public void consume(BookingCreatedEvent event) {

        com.LabResourceUtilizationPlatform.Dtos.Response.NotificationMessage notification = com.LabResourceUtilizationPlatform.Dtos.Response.NotificationMessage.builder()
                .userId(event.getUserId())
                .type(event.getNotificationType())
                .title(event.getTitle())
                .message(event.getMessage())
                .build();

        notificationProducer.sendNotification(notification);

        System.out.println("Booking event consumed: " + event.getBookingId());
    }
}