package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateBookingRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.BookingCostResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.BookingResponse;
import com.LabResourceUtilizationPlatform.Entity.Booking;
import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import com.LabResourceUtilizationPlatform.Entity.Enum.NotificationType;
import com.LabResourceUtilizationPlatform.Entity.Equipment;
import com.LabResourceUtilizationPlatform.Entity.User;
import com.LabResourceUtilizationPlatform.Repository.*;
import com.LabResourceUtilizationPlatform.Service.BookingService;
import com.LabResourceUtilizationPlatform.Service.EquipmentServiceCostService;
import com.LabResourceUtilizationPlatform.Service.NotificationService;
import com.LabResourceUtilizationPlatform.Service.WaitingQueueService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final ModelMapper modelMapper;
    private final WaitingQueueService waitingQueueService;
    private final EquipmentServiceCostRepository equipmentServiceCostRepository;
    private final EquipmentServiceCostService equipmentServiceCostService;


    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) throws BadRequestException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndLab_LabCodeAndLab_Institution_Code(
                        request.getEquipmentCode(),
                        request.getLabCode(),
                        request.getInstitutionCode()
                )
                .orElseThrow(() -> new RuntimeException("Equipment not found."));

        // Validate booking time
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new BadRequestException("Start time must be before end time.");
        }

        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Booking cannot be created for a past time.");
        }

        // Calculate booked quantity
        Integer bookedQuantity = bookingRepository.getBookedQuantityForTimeSlot(
                equipment.getId(),
                List.of(BookingStatus.CONFIRMED),
                request.getStartTime(),
                request.getEndTime()
        );

        if (bookedQuantity == null) {
            bookedQuantity = 0;
        }

        int availableQuantity = equipment.getQuantity() - bookedQuantity;

        if (availableQuantity <= 0) {

            waitingQueueService.addToQueue(
                    user,
                    equipment,
                    request
            );

            throw new BadRequestException(
                    "Equipment is unavailable. You have been added to the waiting queue."
            );
        }

        if (request.getQuantity() > availableQuantity) {
            throw new BadRequestException(
                    "Only " + availableQuantity + " unit(s) are available."
            );
        }

        // Generate Booking Code
        String bookingCode = "BK-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 8)
                        .toUpperCase();

        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .user(user)
                .equipment(equipment)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .quantity(request.getQuantity())
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);

        notificationService.notifyUser(
                user,
                "Booking Created",
                "Your booking " + booking.getBookingCode() + " has been created successfully.",
                NotificationType.BOOKING
        );

        // Calculate and save service cost
        equipmentServiceCostService.calculateCost(booking.getId());

        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public String approveBookingByManager(String bookingCode) {

        Booking booking = bookingRepository
                .findByBookingCode(bookingCode)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CONFIRMED);

        bookingRepository.save(booking);

        notificationService.notifyUser(
                booking.getUser(),
                "Booking Approved",
                "Your booking " + booking.getBookingCode() + " has been approved.",
                NotificationType.BOOKING
        );

        return "Booking approved successfully.";
    }

    @Override
    @Transactional
    public List<BookingResponse> getPendingBookingsForLabManager() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User manager = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        List<Booking> bookings =
                bookingRepository.findByEquipment_Lab_LabManager_IdAndStatus(
                        manager.getId(),
                        BookingStatus.PENDING
                );

        return bookings.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BookingCostResponse estimateCost(
            String institutionCode,
            String labCode,
            String equipmentCode,
            Integer quantity,
            LocalDateTime startTime,
            LocalDateTime endTime) {

        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndLab_LabCodeAndLab_Institution_Code(
                        equipmentCode,
                        labCode,
                        institutionCode
                )
                .orElseThrow(() ->
                        new EntityNotFoundException("Equipment not found."));

        BigDecimal hourlyRate = equipment.getHourlyRate();

        Duration duration = Duration.between(startTime, endTime);

        long hours = Math.max(1, duration.toHours());

        BigDecimal total = hourlyRate
                .multiply(BigDecimal.valueOf(hours))
                .multiply(BigDecimal.valueOf(quantity));

        return BookingCostResponse.builder()
                .hoursUsed(hours)
                .hourlyRate(hourlyRate)
                .quantity(quantity)
                .totalAmount(total)
                .build();
    }

    @Override
    @Transactional
    public Page<BookingResponse> getAllBookings(
            BookingStatus status,
            Long equipmentId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {

        Page<Booking> bookings = bookingRepository.findAll(pageable);

        return bookings.map(booking -> mapToResponse(booking));
    }

    @Override
    @Transactional
    public List<BookingResponse> getMyBookings() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        System.out.println("Email = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        System.out.println("User ID = " + user.getId());

        List<Booking> bookings = bookingRepository.findByUser(user);

        System.out.println("Bookings = " + bookings.size());

        bookings.forEach(b ->
                System.out.println(
                        b.getBookingCode() + " -> " + b.getStatus()
                )
        );

        return bookings.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BookingResponse getBookingByCode(String bookingCode) {
        updateCompletedBookings();


        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse updateBooking(String bookingCode,
                                         CreateBookingRequest request) {

        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be updated.");
        }

        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new RuntimeException("Start time must be before end time.");
        }

        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Booking cannot be updated to a past time.");
        }

        Equipment equipment = equipmentRepository
                .findByEquipmentCodeAndLab_LabCodeAndLab_Institution_Code(
                        request.getEquipmentCode(),
                        request.getLabCode(),
                        request.getInstitutionCode())
                .orElseThrow(() -> new RuntimeException("Equipment not found."));

        Integer bookedQuantity =
                bookingRepository.getBookedQuantityForTimeSlotExcludingBooking(
                        equipment.getId(),
                        List.of(BookingStatus.CONFIRMED),
                        request.getStartTime(),
                        request.getEndTime(),
                        booking.getId()
                );

        if (bookedQuantity == null) {
            bookedQuantity = 0;
        }

        int availableQuantity = equipment.getQuantity() - bookedQuantity;

        if (availableQuantity <= 0) {
            throw new RuntimeException("Equipment is currently unavailable.");
        }

        if (request.getQuantity() > availableQuantity) {
            throw new RuntimeException(
                    "Only " + availableQuantity + " unit(s) are available."
            );
        }

        booking.setEquipment(equipment);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setQuantity(request.getQuantity());

        booking = bookingRepository.save(booking);

        // Recalculate service cost
        equipmentServiceCostService.updateCost(booking.getId());

        return mapToResponse(booking);
    }


    private void updateCompletedBookings() {
        LocalDateTime now = LocalDateTime.now();

        List<Booking> bookings = bookingRepository.findByStatus(BookingStatus.CONFIRMED);

        for (Booking booking : bookings) {
            if (!booking.getEndTime().isAfter(now)) {
                booking.setStatus(BookingStatus.COMPLETED);
            }
        }

        bookingRepository.saveAll(bookings);
    }


    @Override
    @Transactional
    public String cancelBooking(String bookingCode) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can cancel only your own bookings.");
        }

        cancel(booking);

        return "Booking cancelled successfully.";
    }

    @Override
    @Transactional
    public List<BookingResponse> getCalendarBookings(
            Integer month,
            Integer year,
            Long equipmentId,
            Long labId) {

        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());

        LocalDateTime start = firstDay.atStartOfDay();
        LocalDateTime end = lastDay.atTime(LocalTime.MAX);

        List<Booking> bookings = bookingRepository.findByStartTimeBetween(start, end);

        return bookings.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    protected void cancel(Booking booking) {

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled.");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Completed bookings cannot be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        notificationService.notifyUser(
                booking.getUser(),
                "Booking Cancelled",
                "Your booking " + booking.getBookingCode() + " has been cancelled.",
                NotificationType.BOOKING
        );
        waitingQueueService.allocateNextWaitingUser(
                booking.getEquipment().getId()
        );
    }

    @Override
    @Transactional
    public String completeBooking(String bookingCode) {

        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be completed.");
        }

        booking.setStatus(BookingStatus.COMPLETED);

        bookingRepository.save(booking);
        notificationService.notifyUser(
                booking.getUser(),
                "Booking Completed",
                "Your booking " + booking.getBookingCode() + " has been completed.",
                NotificationType.BOOKING
        );

        waitingQueueService.allocateNextWaitingUser(
                booking.getEquipment().getId()
        );

        return "Booking completed successfully.";
    }

    @Override
    @Transactional
    public String cancelBookingByManager(String bookingCode) {

        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        // No ownership check; authorization is handled by the role.
        cancel(booking);

        return "Booking cancelled by Lab Manager successfully.";
    }

    private BookingResponse mapToResponse(Booking booking) {

        System.out.println("Mapping: " + booking.getBookingCode());

        BookingResponse response = new BookingResponse();

        response.setBookingCode(booking.getBookingCode());

        System.out.println("1");
        response.setBookedBy(booking.getUser().getFullName());

        System.out.println("2");
        response.setEquipmentName(booking.getEquipment().getEquipmentName());

        System.out.println("3");
        response.setInstitutionName(
                booking.getUser().getInstitution().getName());

        System.out.println("4");
        response.setDepartmentName(
                booking.getUser().getDepartment().getName());

        System.out.println("5");
        response.setStartTime(booking.getStartTime());

        response.setEndTime(booking.getEndTime());
        response.setPurpose(booking.getPurpose());
        response.setQuantity(booking.getQuantity());
        response.setStatus(booking.getStatus());
        response.setCreatedAt(booking.getCreatedAt());

        equipmentServiceCostRepository
                .findByBookingId(booking.getId())
                .ifPresent(serviceCost ->
                        response.setServiceCost(serviceCost.getTotalCost()));

        System.out.println("Done");

        return response;
    }
}
