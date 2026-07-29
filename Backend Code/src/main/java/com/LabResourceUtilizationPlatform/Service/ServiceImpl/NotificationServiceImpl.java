package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Response.NotificationDTO;
import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import com.LabResourceUtilizationPlatform.Entity.Notification;
import com.LabResourceUtilizationPlatform.Entity.User;
import com.LabResourceUtilizationPlatform.Repository.NotificationRepository;
import com.LabResourceUtilizationPlatform.Service.NotificationService;
import com.LabResourceUtilizationPlatform.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final UserService userService;
    private final NotificationRepository notificationRepository;

    @Override
    public void notifyUser(
            User user,
            String title,
            String message,
            NotificationType type) {

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDTO> getMyNotifications() {

        User user = userService.getCurrentUser();

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications() {

        User user = userService.getCurrentUser();

        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public void markRead(Long id) {

        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);

        notificationRepository.save(notification);
    }

    @Override
    public void markAllRead() {

        User user = userService.getCurrentUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());

        notifications.forEach(notification -> notification.setIsRead(true));

        notificationRepository.saveAll(notifications);
    }

    @Override
    public long unreadCount() {

        User user = userService.getCurrentUser();

        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    private NotificationDTO map(Notification notification) {

        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}