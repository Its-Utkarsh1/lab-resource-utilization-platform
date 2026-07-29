package com.LabResourceUtilizationPlatform.Controller;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateEquipmentRequest;
import com.LabResourceUtilizationPlatform.Dtos.Request.UpdateEquipmentRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.EquipmentDetailResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.EquipmentResponse;
import com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus;
import com.LabResourceUtilizationPlatform.Service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PreAuthorize("hasAnyRole('LAB_MANAGER', 'SYSTEM_ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EquipmentResponse> createEquipment(
            @Valid @ModelAttribute CreateEquipmentRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(equipmentService.createEquipment(request, image));
    }

    @GetMapping("/department")
    public ResponseEntity<List<EquipmentResponse>> getDepartmentEquipment(
            @RequestParam String institutionCode,
            @RequestParam String departmentName) {

        return ResponseEntity.ok(
                equipmentService.getDepartmentEquipment(
                        institutionCode,
                        departmentName));
    }

    @GetMapping("/{institutionCode}/{labCode}/{equipmentCode}")
    public ResponseEntity<EquipmentResponse> getEquipmentByCode(
            @PathVariable String institutionCode,
            @PathVariable String labCode,
            @PathVariable String equipmentCode) {

        return ResponseEntity.ok(
                equipmentService.getEquipmentByCode(
                        equipmentCode,
                        labCode,
                        institutionCode));
    }

    @GetMapping("/{institutionCode}/{labCode}")
    public ResponseEntity<List<EquipmentResponse>> getAllEquipment(
            @PathVariable String institutionCode,
            @PathVariable String labCode) {

        return ResponseEntity.ok(
                equipmentService.getAllEquipment(
                        labCode,
                        institutionCode));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('LAB_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<EquipmentResponse> updateEquipment(
            @Valid @RequestBody UpdateEquipmentRequest request) {

        return ResponseEntity.ok(
                equipmentService.updateEquipment(request));
    }

    @PreAuthorize("hasAnyRole('LAB_MANAGER', 'SYSTEM_ADMIN')")
    @GetMapping("/status-counts/{institutionCode}")
    public ResponseEntity<Map<String, Long>> getEquipmentStatusCounts(
            @PathVariable String institutionCode) {

        return ResponseEntity.ok(
                equipmentService.getEquipmentStatusCounts(institutionCode));
    }

    @PatchMapping("/{equipmentCode}/status")
    @PreAuthorize("hasAnyRole('LAB_MANAGER','SYSTEM_ADMIN')")
    public ResponseEntity<String> updateStatus(
            @PathVariable String equipmentCode,
            @RequestParam EquipmentStatus status) {

        System.out.println("UPDATE STATUS API HIT");

        equipmentService.updateStatus(equipmentCode, status);

        return ResponseEntity.ok("Equipment status updated successfully.");
    }

    @DeleteMapping("/{institutionCode}/{labCode}/{equipmentCode}")
    @PreAuthorize("hasAnyRole('LAB_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<String> deleteEquipment(
            @PathVariable String institutionCode,
            @PathVariable String labCode,
            @PathVariable String equipmentCode) {

        equipmentService.deleteEquipment(
                equipmentCode,
                labCode,
                institutionCode);

        return ResponseEntity.ok("Equipment deleted successfully.");
    }

    @PreAuthorize("hasAnyRole('LAB_MANAGER', 'SYSTEM_ADMIN')")
    @GetMapping("/{equipmentCode}/details")
    public ResponseEntity<EquipmentDetailResponse> getEquipmentDetail(
            @PathVariable String equipmentCode,
            @RequestParam String labCode,
            @RequestParam String institutionCode) {

        return ResponseEntity.ok(
                equipmentService.getEquipmentDetail(
                        equipmentCode,
                        labCode,
                        institutionCode));
    }
}
