package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Entity.Booking;
import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import com.LabResourceUtilizationPlatform.Repository.BookingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingScheduler {

    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 60000) // every 1 minute
    @Transactional
    public void cancelExpiredBookings() {

        List<Booking> bookings = bookingRepository
                .findByStatusAndEndTimeBefore(
                        BookingStatus.PENDING,
                        LocalDateTime.now());

        bookings.forEach(booking ->
                booking.setStatus(BookingStatus.CANCELLED));

        bookingRepository.saveAll(bookings);
    }
}