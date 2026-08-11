package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateSharingRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.DepartmentResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.InstitutionResponse;
import com.LabResourceUtilizationPlatform.Dtos.Response.SharingResponse;

import java.util.List;

public interface EquipmentSharingService {

    /**
     * Institution Admin requests equipment
     * from another institution.
     */
    SharingResponse requestEquipment(CreateSharingRequest request);

    List<SharingResponse> getAvailableEquipment(
            String institutionCode,
            String departmentName
    );
    List<InstitutionResponse> getAvailableInstitutions();
    /**
     * Equipment available for sharing
     * (excluding logged-in institution).
     */

    List<DepartmentResponse> getDepartments(String institutionCode);
    /**
     * Requests received by my institution.
     */
    List<SharingResponse> getIncomingRequests();

    List<SharingResponse> getDashboardAvailableEquipment();

    /**
     * Requests sent by my institution.
     */
    List<SharingResponse> getOutgoingRequests();

    /**
     * Approve sharing request.
     */
    SharingResponse approveRequest(String sharingCode);

    /**
     * Reject sharing request.
     */
    SharingResponse rejectRequest(String sharingCode);

    /**
     * Mark sharing as active.
     */
    SharingResponse startSharing(String sharingCode);

    /**
     * Complete sharing after equipment return.
     */
    SharingResponse completeSharing(String sharingCode);

    /**
     * Cancel sharing request.
     */
    SharingResponse cancelSharing(String sharingCode);

    /**
     * Complete history.
     */
    List<SharingResponse> getSharingHistory();

    /**
     * Get one sharing request.
     */
    SharingResponse getSharingByCode(String sharingCode);
}