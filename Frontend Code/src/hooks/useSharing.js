import { useQuery, useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import sharingService from "../services/sharingService";

// ---------------- Available Equipment ----------------

export const useAvailableEquipment = (
  institutionCode,
  departmentName
) => {
  return useQuery(
    ["available-equipment", institutionCode, departmentName],
    () =>
      sharingService.getAvailableEquipment(
        institutionCode,
        departmentName
      ),
    {
      enabled: !!institutionCode && !!departmentName,
    }
  );
};



// ---------------- Available Institutions ----------------

export const useAvailableInstitutions = () => {
  return useQuery(
    ["available-institutions"],
    sharingService.getAvailableInstitutions
  );
};

// ---------------- Request Equipment ----------------

export const useRequestEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    sharingService.requestEquipment,
    {
      onSuccess: () => {
        toast.success("Sharing request submitted.");
        queryClient.invalidateQueries("outgoing-requests");
        queryClient.invalidateQueries("available-equipment");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ||
          "Failed to submit request."
        );
      },
    }
  );
};

// ---------------- Incoming Requests ----------------

export const useIncomingRequests = () => {
  return useQuery(
    ["incoming-requests"],
    sharingService.getIncomingRequests
  );
};

// ---------------- Outgoing Requests ----------------

export const useOutgoingRequests = () => {
  return useQuery(
    ["outgoing-requests"],
    sharingService.getOutgoingRequests
  );
};

// ---------------- Sharing History ----------------

export const useSharingHistory = () => {
  return useQuery(
    ["sharing-history"],
    sharingService.getSharingHistory
  );
};

// ---------------- Sharing Details ----------------

export const useSharing = (sharingCode) => {
  return useQuery(
    ["sharing", sharingCode],
    () => sharingService.getSharingByCode(sharingCode),
    {
      enabled: !!sharingCode,
    }
  );
};

// ---------------- Approve ----------------

export const useApproveSharing = () => {
  const queryClient = useQueryClient();

  return useMutation(
    sharingService.approveRequest,
    {
      onSuccess: () => {
        toast.success("Request approved.");
        queryClient.invalidateQueries("incoming-requests");
        queryClient.invalidateQueries("outgoing-requests");
        queryClient.invalidateQueries("sharing-history");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ||
          "Approval failed."
        );
      },
    }
  );
};

// ---------------- Reject ----------------

export const useRejectSharing = () => {
  const queryClient = useQueryClient();

  return useMutation(
    sharingService.rejectRequest,
    {
      onSuccess: () => {
        toast.success("Request rejected.");
        queryClient.invalidateQueries("incoming-requests");
        queryClient.invalidateQueries("outgoing-requests");
        queryClient.invalidateQueries("sharing-history");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ||
          "Reject failed."
        );
      },
    }
  );
};

// ---------------- Start Sharing ----------------

export const useStartSharing = () => {
  const queryClient = useQueryClient();

  return useMutation(sharingService.startSharing, {
    onSuccess: () => {
      toast.success("Sharing started.");
      queryClient.invalidateQueries("incoming-requests");
      queryClient.invalidateQueries("sharing-history");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to start sharing."
      );
    },
  });
};

// ---------------- Complete Sharing ----------------

export const useCompleteSharing = () => {
  const queryClient = useQueryClient();

  return useMutation(sharingService.completeSharing, {
    onSuccess: () => {
      toast.success("Sharing completed.");
      queryClient.invalidateQueries("incoming-requests");
      queryClient.invalidateQueries("sharing-history");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to complete sharing."
      );
    },
  });
};

export const useDepartments = (institutionCode) => {
  return useQuery(
    ["departments", institutionCode],
    () => sharingService.getDepartments(institutionCode),
    {
      enabled: !!institutionCode,
    }
  );
};

// ---------------- Cancel Sharing ----------------

export const useCancelSharing = () => {
  const queryClient = useQueryClient();

  return useMutation(sharingService.cancelSharing, {
    onSuccess: () => {
      toast.success("Request cancelled.");
      queryClient.invalidateQueries("outgoing-requests");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel request."
      );
    },
  });
};