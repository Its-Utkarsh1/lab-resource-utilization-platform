package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Dtos.Response.InvoiceResponse;
import com.LabResourceUtilizationPlatform.Entity.Booking;

import java.util.List;

public interface InvoiceService {

    InvoiceResponse getInvoice(Long bookingId);

    List<InvoiceResponse> getMyInvoices();

    void createInvoice(Booking booking);

    List<InvoiceResponse> getInstitutionInvoices();
}