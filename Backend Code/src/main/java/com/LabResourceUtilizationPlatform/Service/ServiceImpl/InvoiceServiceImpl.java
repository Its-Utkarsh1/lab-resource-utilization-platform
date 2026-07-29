package com.LabResourceUtilizationPlatform.Service.ServiceImpl;

import com.LabResourceUtilizationPlatform.Dtos.Response.InvoiceResponse;
import com.LabResourceUtilizationPlatform.Entity.Booking;
import com.LabResourceUtilizationPlatform.Entity.Enum.PaymentStatus;
import com.LabResourceUtilizationPlatform.Entity.Invoice;
import com.LabResourceUtilizationPlatform.Entity.User;
import com.LabResourceUtilizationPlatform.Repository.EquipmentServiceCostRepository;
import com.LabResourceUtilizationPlatform.Repository.InvoiceRepository;
import com.LabResourceUtilizationPlatform.Repository.UserRepository;
import com.LabResourceUtilizationPlatform.Service.InvoiceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {


    private final InvoiceRepository invoiceRepository;
    private final EquipmentServiceCostRepository equipmentServiceCostRepository;
    private final UserRepository userRepository;


    @Override
    public void createInvoice(Booking booking) {

        var serviceCost = equipmentServiceCostRepository
                .findByBookingId(booking.getId())
                .orElseThrow(() -> new EntityNotFoundException("Service cost not found."));

        Invoice invoice = new Invoice();

        invoice.setBooking(booking);
        invoice.setInstitution(booking.getUser().getInstitution());
        invoice.setAmount(serviceCost.getTotalCost()); // or calculate amount
        invoice.setPaymentStatus(PaymentStatus.PENDING);
        invoice.setInvoiceDate(LocalDateTime.now());

        invoiceRepository.save(invoice);
    }


    @Override
    public InvoiceResponse getInvoice(Long bookingId) {

        Invoice invoice = invoiceRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Invoice not found."));

        return mapToResponse(invoice);
    }

    @Override
    public List<InvoiceResponse> getMyInvoices() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));

        return invoiceRepository.findByBooking_User_Id(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<InvoiceResponse> getInstitutionInvoices() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));

        return invoiceRepository
                .findByInstitutionId(user.getInstitution().getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {

        var serviceCost = equipmentServiceCostRepository
                .findByBookingId(invoice.getBooking().getId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Service cost not found."));

        return InvoiceResponse.builder()
                .invoiceId(invoice.getId())
                .bookingCode(invoice.getBooking().getBookingCode())
                .institutionName(invoice.getInstitution().getName())
                .userName(invoice.getBooking().getUser().getFullName())
                .equipmentName(invoice.getBooking().getEquipment().getEquipmentName())
                .quantity(invoice.getBooking().getQuantity())
                .hoursUsed(serviceCost.getHoursUsed())
                .hourlyRate(serviceCost.getHourlyRate())
                .amount(invoice.getAmount())
                .paymentStatus(invoice.getPaymentStatus())
                .invoiceDate(invoice.getInvoiceDate())
                .build();
    }
}