package com.LabResourceUtilizationPlatform.Controller;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateSharingRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.DepartmentResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.InstitutionResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.SharingResponse;
import com.LabResourceUtilizationPlatform.Service.EquipmentSharingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sharing")
@RequiredArgsConstructor
@CrossOrigin
public class EquipmentSharingController {

    private final EquipmentSharingService equipmentSharingService;

    /**
     * Request equipment from another institution
     */
    @PostMapping("/request")
    public ResponseEntity<SharingResponse> requestEquipment(
            @Valid @RequestBody CreateSharingRequest request) {

        return ResponseEntity.ok(
                equipmentSharingService.requestEquipment(request)
        );
    }

    /**
     * Available institutions (except logged-in institution)
     */
    @GetMapping("/institutions")
    public ResponseEntity<List<InstitutionResponse>> getAvailableInstitutions() {

        return ResponseEntity.ok(
                equipmentSharingService.getAvailableInstitutions()
        );
    }

    /**
     * Dashboard - All available equipment except logged-in institution
     */
    @GetMapping("/dashboard/available")
    public ResponseEntity<List<SharingResponse>> getDashboardAvailableEquipment() {

        return ResponseEntity.ok(
                equipmentSharingService.getDashboardAvailableEquipment()
        );
    }

    /**
     * Available equipment by institution & department
     */
    @GetMapping("/available")
    public ResponseEntity<List<SharingResponse>> getAvailableEquipment(
            @RequestParam String institutionCode,
            @RequestParam String departmentName) {

        System.out.println("institutionCode = " + institutionCode);
        System.out.println("departmentName = " + departmentName);

        try {
            return ResponseEntity.ok(
                    equipmentSharingService.getAvailableEquipment(
                            institutionCode,
                            departmentName
                    )
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Departments of selected institution
     */
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentResponse>> getDepartments(
            @RequestParam String institutionCode) {

        return ResponseEntity.ok(
                equipmentSharingService.getDepartments(institutionCode)
        );
    }

    /**
     * Incoming requests
     */
    @GetMapping("/incoming")
    public ResponseEntity<List<SharingResponse>> getIncomingRequests() {

        return ResponseEntity.ok(
                equipmentSharingService.getIncomingRequests()
        );
    }

    /**
     * Outgoing requests
     */
    @GetMapping("/outgoing")
    public ResponseEntity<List<SharingResponse>> getOutgoingRequests() {

        return ResponseEntity.ok(
                equipmentSharingService.getOutgoingRequests()
        );
    }

    /**
     * Sharing history
     */
    @GetMapping("/history")
    public ResponseEntity<List<SharingResponse>> getSharingHistory() {

        return ResponseEntity.ok(
                equipmentSharingService.getSharingHistory()
        );
    }

    /**
     * Sharing details
     */
    @GetMapping("/{sharingCode}")
    public ResponseEntity<SharingResponse> getSharingByCode(
            @PathVariable String sharingCode) {

        return ResponseEntity.ok(
                equipmentSharingService.getSharingByCode(sharingCode)
        );
    }

    /**
     * Approve request
     */
    @PutMapping("/{sharingCode}/approve")
    public ResponseEntity<SharingResponse> approveRequest(
            @PathVariable String sharingCode) {

        return ResponseEntity.ok(
                equipmentSharingService.approveRequest(sharingCode)
        );
    }

    /**
     * Reject request
     */
    @PutMapping("/{sharingCode}/reject")
    public ResponseEntity<SharingResponse> rejectRequest(
            @PathVariable String sharingCode) {

        return ResponseEntity.ok(
                equipmentSharingService.rejectRequest(sharingCode)
        );
    }

    /**
     * Start sharing
     */
    @PutMapping("/{sharingCode}/start")
    public ResponseEntity<SharingResponse> startSharing(
            @PathVariable String sharingCode) {

        return ResponseEntity.ok(
                equipmentSharingService.startSharing(sharingCode)
        );
    }

    /**
     * Complete sharing
     */
    @PutMapping("/{sharingCode}/complete")
    public ResponseEntity<SharingResponse> completeSharing(
            @PathVariable String sharingCode) {

        return ResponseEntity.ok(
                equipmentSharingService.completeSharing(sharingCode)
        );
    }

    /**
     * Cancel sharing request
     */
    @PutMapping("/{sharingCode}/cancel")
    public ResponseEntity<SharingResponse> cancelSharing(
            @PathVariable String sharingCode) {

        return ResponseEntity.ok(
                equipmentSharingService.cancelSharing(sharingCode)
        );
    }
}