package com.LabResourceUtilizationPlatform.Entity;

import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Builder
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Builder.Default
    private Boolean isRead = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;
}