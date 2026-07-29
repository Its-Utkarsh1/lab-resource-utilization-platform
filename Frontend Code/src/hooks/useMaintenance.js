import { useQuery, useMutation, useQueryClient } from "react-query";
import maintenanceService from "../services/maintenanceService";
import toast from "react-hot-toast";

export const useMaintenance = (params = {}) => {
  return useQuery(
    ["maintenance", params],
    () => maintenanceService.getAll(params)
  );
};

export const useUpcomingMaintenance = () => {
  return useQuery(
    "upcoming-maintenance",
    maintenanceService.getUpcoming
  );
};

export const useMaintenanceById = (id) => {
  return useQuery(
    ["maintenance", id],
    () => maintenanceService.getById(id),
    {
      enabled: !!id,
    }
  );
};

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation(maintenanceService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("maintenance");
      queryClient.invalidateQueries("upcoming-maintenance");
      toast.success("Maintenance scheduled successfully");
    },
  });
};

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }) => maintenanceService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("maintenance");
        queryClient.invalidateQueries("upcoming-maintenance");
        toast.success("Maintenance updated successfully");
      },
    }
  );
};

export const useMyMaintenance = () => {
  return useQuery(
    ["my-maintenance"],
    maintenanceService.getMyMaintenance
  );
};

export const useStartMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation(maintenanceService.start, {
    onSuccess: () => {
      queryClient.invalidateQueries("my-maintenance");
      toast.success("Maintenance started.");
    },
  });
};

export const useCompleteMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation(maintenanceService.complete, {
    onSuccess: () => {
      queryClient.invalidateQueries("maintenance");
      queryClient.invalidateQueries("upcoming-maintenance");
      toast.success("Maintenance completed");
    },
  });
};