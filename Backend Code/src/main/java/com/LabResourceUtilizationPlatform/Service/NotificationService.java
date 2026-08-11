package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Dtos.Response.NotificationDTO;
import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;

import java.util.List;

public interface NotificationService {

    void createNotification(
            Long userId,
            NotificationType type,
            String title,
            String message
    );

    List<NotificationDTO> getMyNotifications();

    List<NotificationDTO> getUnreadNotifications();

    long unreadCount();

    void markRead(Long notificationId);

    void markAllRead();
}
