package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Dtos.Response.NotificationDTO;
import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import com.LabResourceUtilizationPlatform.Entity.User;

import java.util.List;

public interface NotificationService {

    void notifyUser(
            User user,
            String title,
            String message,
            NotificationType type
    );

    List<NotificationDTO> getMyNotifications();

    List<NotificationDTO> getUnreadNotifications();

    void markRead(Long id);

    void markAllRead();

    long unreadCount();
}
