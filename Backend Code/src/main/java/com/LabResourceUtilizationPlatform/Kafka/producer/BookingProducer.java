package com.LabResourceUtilizationPlatform.Kafka.producer;

import com.LabResourceUtilizationPlatform.Kafka.event.BookingCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(BookingCreatedEvent event) {
        kafkaTemplate.send("booking-created", event);
    }
}
