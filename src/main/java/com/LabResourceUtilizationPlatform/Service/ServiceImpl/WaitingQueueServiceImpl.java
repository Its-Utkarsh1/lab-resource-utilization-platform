package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateBookingRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.WaitingQueueResponse;
import com.LabResourceUtilizationPlatform.Entity.Booking;
import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import com.LabResourceUtilizationPlatform.Entity.Equipment;
import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import com.LabResourceUtilizationPlatform.Entity.Enum.WaitingQueueStatus;
import com.LabResourceUtilizationPlatform.Entity.User;
import com.LabResourceUtilizationPlatform.Entity.WaitingQueue;
import com.LabResourceUtilizationPlatform.Repository.BookingRepository;
import com.LabResourceUtilizationPlatform.Repository.UserRepository;
import com.LabResourceUtilizationPlatform.Repository.WaitingQueueRepository;
import com.LabResourceUtilizationPlatform.Service.EquipmentServiceCostService;
import com.LabResourceUtilizationPlatform.Service.NotificationService;
import com.LabResourceUtilizationPlatform.Service.WaitingQueueService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class WaitingQueueServiceImpl implements WaitingQueueService {

    private final WaitingQueueRepository waitingQueueRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EquipmentServiceCostService equipmentServiceCostService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void addToQueue(User user,
                           Equipment equipment,
                           CreateBookingRequest request) {

        WaitingQueue queue = WaitingQueue.builder()
                .user(user)
                .equipment(equipment)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .quantity(request.getQuantity())
                .status(WaitingQueueStatus.WAITING)
                .build();

        waitingQueueRepository.save(queue);
        notificationService.notifyUser(
                user,
                "Added to Waiting Queue",
                "You have been added to the waiting queue for " +
                        equipment.getEquipmentName() + ".",
                NotificationType.WAITING_QUEUE
        );
    }

    @Override
    @Transactional
    public void allocateNextWaitingUser(Long equipmentId) {

        WaitingQueue queue = waitingQueueRepository
                .findFirstByEquipmentIdAndStatusOrderByCreatedAtAsc(
                        equipmentId,
                        WaitingQueueStatus.WAITING
                )
                .orElse(null);

        if (queue == null) {
            return;
        }

        String bookingCode = "BK-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 8)
                        .toUpperCase();

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .user(queue.getUser())
                .equipment(queue.getEquipment())
                .startTime(queue.getStartTime())
                .endTime(queue.getEndTime())
                .purpose(queue.getPurpose())
                .quantity(queue.getQuantity())
                .status(BookingStatus.CONFIRMED)
                .build();

        booking = bookingRepository.save(booking);

        equipmentServiceCostService.calculateCost(booking.getId());

        queue.setStatus(WaitingQueueStatus.ALLOCATED);

        waitingQueueRepository.save(queue);

        notificationService.notifyUser(
                queue.getUser(),
                "Equipment Allocated",
                "The equipment '" + queue.getEquipment().getEquipmentName() +
                        "' is now available and has been allocated to you. Booking Code: "
                        + booking.getBookingCode(),
                NotificationType.WAITING_QUEUE
        );
    }

    @Override
    @Transactional
    public void removeFromQueue(Long queueId) {

        WaitingQueue queue = waitingQueueRepository.findById(queueId)
                .orElseThrow(() ->
                        new RuntimeException("Queue entry not found."));

        queue.setStatus(WaitingQueueStatus.CANCELLED);

        waitingQueueRepository.save(queue);

        notificationService.notifyUser(
                queue.getUser(),
                "Waiting Queue Cancelled",
                "You have been removed from the waiting queue for " +
                        queue.getEquipment().getEquipmentName() + ".",
                NotificationType.WAITING_QUEUE
        );
    }

    @Override
    public List<WaitingQueueResponse> getEquipmentQueue(Long equipmentId) {

        List<WaitingQueue> queues =
                waitingQueueRepository
                        .findByEquipmentIdAndStatusOrderByCreatedAtAsc(
                                equipmentId,
                                WaitingQueueStatus.WAITING);

        AtomicInteger position = new AtomicInteger(1);

        return queues.stream()
                .map(queue -> WaitingQueueResponse.builder()
                        .id(queue.getId())
                        .equipmentCode(queue.getEquipment().getEquipmentCode())
                        .equipmentName(queue.getEquipment().getEquipmentName())
                        .userName(queue.getUser().getFullName())
                        .email(queue.getUser().getEmail())
                        .startTime(queue.getStartTime())
                        .endTime(queue.getEndTime())
                        .quantity(queue.getQuantity())
                        .purpose(queue.getPurpose())
                        .status(queue.getStatus())
                        .position(position.getAndIncrement())
                        .createdAt(queue.getCreatedAt())
                        .build())
                .toList();
    }

    @Override
    public List<WaitingQueueResponse> getMyQueue() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        List<WaitingQueue> queues =
                waitingQueueRepository.findByUserId(user.getId());

        AtomicInteger position = new AtomicInteger(1);

        return queues.stream()
                .filter(q -> q.getStatus() == WaitingQueueStatus.WAITING)
                .map(queue -> WaitingQueueResponse.builder()
                        .id(queue.getId())
                        .equipmentCode(queue.getEquipment().getEquipmentCode())
                        .equipmentName(queue.getEquipment().getEquipmentName())
                        .userName(queue.getUser().getFullName())
                        .email(queue.getUser().getEmail())
                        .startTime(queue.getStartTime())
                        .endTime(queue.getEndTime())
                        .quantity(queue.getQuantity())
                        .purpose(queue.getPurpose())
                        .status(queue.getStatus())
                        .position(position.getAndIncrement())
                        .createdAt(queue.getCreatedAt())
                        .build())
                .toList();
    }
}