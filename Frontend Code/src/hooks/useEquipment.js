import { useQuery, useMutation, useQueryClient } from "react-query";
import equipmentService from "../services/equipmentService";
import toast from "react-hot-toast";

export const useEquipment = (institutionCode, labCode) => {
  return useQuery(
    ["equipment", institutionCode, labCode],
    () => equipmentService.getByLab(institutionCode, labCode),
    {
      enabled: !!institutionCode && !!labCode,
    }
  );
};

export const useEquipmentByCode = (
  institutionCode,
  labCode,
  equipmentCode
) => {
  return useQuery(
    ["equipment", institutionCode, labCode, equipmentCode],
    () =>
      equipmentService.getByCode(
        institutionCode,
        labCode,
        equipmentCode
      ),
    {
      enabled:
        !!institutionCode &&
        !!labCode &&
        !!equipmentCode,

      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
    }
  );
};

export const useUpdateEquipmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ equipmentCode, status }) =>
      equipmentService.updateStatus(equipmentCode, status),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["equipment"]);
        await queryClient.refetchQueries(["equipment"]);

        toast.success("Equipment status updated.");
      },
    }
  );
};

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation(equipmentService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(["equipment"]);
      toast.success("Equipment created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to create equipment"
      );
    },
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation(equipmentService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries(["equipment"]);
      toast.success("Equipment updated successfully");
    },
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ institutionCode, labCode, equipmentCode }) =>
      equipmentService.delete(
        institutionCode,
        labCode,
        equipmentCode
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["equipment"]);
        toast.success("Equipment deleted successfully");
      },
    }
  );
};