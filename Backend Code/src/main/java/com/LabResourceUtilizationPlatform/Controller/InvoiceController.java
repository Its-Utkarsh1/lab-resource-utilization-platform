package com.LabResourceUtilizationPlatform.Controller;

import com.LabResourceUtilizationPlatform.Dtos.Response.InvoiceResponse;
import com.LabResourceUtilizationPlatform.Service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{bookingId}")
    public ResponseEntity<InvoiceResponse> getInvoice(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                invoiceService.getInvoice(bookingId)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<InvoiceResponse>> getMyInvoices() {

        return ResponseEntity.ok(
                invoiceService.getMyInvoices()
        );
    }

    @GetMapping("/institution")
    public ResponseEntity<List<InvoiceResponse>> getInstitutionInvoices() {

        return ResponseEntity.ok(
                invoiceService.getInstitutionInvoices()
        );
    }
}