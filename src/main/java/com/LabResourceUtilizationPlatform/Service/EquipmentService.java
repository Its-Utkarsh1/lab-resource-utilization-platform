package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateEquipmentRequest;
import com.LabResourceUtilizationPlatform.Dtos.Request.UpdateEquipmentRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.EquipmentDetailResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.EquipmentResponse;
import com.LabResourceUtilizationPlatform.Entity.Enum.EquipmentStatus;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.Map;

public interface EquipmentService {

    EquipmentResponse createEquipment(CreateEquipmentRequest request, MultipartFile image);

    EquipmentResponse getEquipmentByCode(
            String equipmentCode,
            String labCode,
            String institutionCode);

    List<EquipmentResponse> getAllEquipment(
            String labCode,
            String institutionCode);

    EquipmentResponse updateEquipment(UpdateEquipmentRequest request);

    void deleteEquipment(
            String equipmentCode,
            String labCode,
            String institutionCode);

    Map<String, Long> getEquipmentStatusCounts(String institutionCode);

    EquipmentDetailResponse getEquipmentDetail(
            String equipmentCode,
            String labCode,
            String institutionCode);

    List<EquipmentResponse> getDepartmentEquipment(String institutionCode, String departmentName);

    void updateStatus(String equipmentCode, EquipmentStatus status);
}
