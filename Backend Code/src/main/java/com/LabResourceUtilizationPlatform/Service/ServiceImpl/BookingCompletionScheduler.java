package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Entity.Booking;
import com.LabResourceUtilizationPlatform.Entity.Enum.BookingStatus;
import com.LabResourceUtilizationPlatform.Repository.BookingRepository;
import com.LabResourceUtilizationPlatform.Service.InvoiceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingCompletionScheduler {

    private final BookingRepository bookingRepository;
    private final InvoiceService invoiceService;

    @Scheduled(fixedRate = 60000) // every 1 minute
    @Transactional
    public void completeBookings() {

        List<Booking> bookings =
                bookingRepository.findByStatusAndEndTimeBefore(
                        BookingStatus.CONFIRMED,
                        LocalDateTime.now()
                );

        for (Booking booking : bookings) {

            booking.setStatus(BookingStatus.COMPLETED);

            // Generate invoice only once
            invoiceService.createInvoice(booking);
        }

        bookingRepository.saveAll(bookings);
    }
}