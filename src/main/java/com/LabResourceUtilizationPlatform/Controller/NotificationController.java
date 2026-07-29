package com.LabResourceUtilizationPlatform.Controller;

import com.LabResourceUtilizationPlatform.Dtos.Response.NotificationDTO;
import com.LabResourceUtilizationPlatform.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Get all notifications of logged-in user
    @GetMapping
    public List<NotificationDTO> getMyNotifications() {
        return notificationService.getMyNotifications();
    }

    // Get unread notifications
    @GetMapping("/unread")
    public List<NotificationDTO> getUnreadNotifications() {
        return notificationService.getUnreadNotifications();
    }

    // Get unread notification count
    @GetMapping("/count")
    public long getUnreadCount() {
        return notificationService.unreadCount();
    }

    // Mark a notification as read
    @PutMapping("/{id}/read")
    public String markAsRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return "Notification marked as read successfully.";
    }

    // Mark all notifications as read
    @PutMapping("/read-all")
    public String markAllAsRead() {
        notificationService.markAllRead();
        return "All notifications marked as read successfully.";
    }
}