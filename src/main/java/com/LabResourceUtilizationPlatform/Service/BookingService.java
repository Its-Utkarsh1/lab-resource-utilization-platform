package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateBookingRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.BookingCostResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.BookingResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.WeeklyUtilizationResponse;
import com.LabResourceUtilizationPlatform.Entity.Booking;
import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {

    BookingResponse getBookingByCode(String bookingCode);

    Page<BookingResponse> getAllBookings(
            BookingStatus status,
            Long equipmentId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable);

    List<BookingResponse> getMyBookings();

    BookingResponse createBooking(CreateBookingRequest request) throws BadRequestException;

    BookingResponse updateBooking(String bookingCode, CreateBookingRequest request);

    String completeBooking(String bookingCode);

    String cancelBooking(String bookingCode);

    String cancelBookingByManager(String bookingCode);

     List<BookingResponse> getCalendarBookings(
            Integer month,
            Integer year,
            Long equipmentId,
            Long labId);

    List<BookingResponse> getPendingBookingsForLabManager();

    BookingCostResponse estimateCost(
            String institutionCode,
            String labCode,
            String equipmentCode,
            Integer quantity,
            LocalDateTime startTime,
            LocalDateTime endTime
    );

    String approveBookingByManager(String bookingCode);
}
