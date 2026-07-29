import { useQuery, useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import institutionService from "../services/institutionService";

export const useInstitutions = () => {
  return useQuery(
    ["institutions"],
    institutionService.getAll
  );
};

export const useInstitution = (institutionCode) => {
  return useQuery(
    ["institution", institutionCode],
    () => institutionService.getByCode(institutionCode),
    {
      enabled: !!institutionCode,
    }
  );
};

export const useCreateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation(institutionService.create, {
    onSuccess: () => {
      toast.success("Institution created successfully");
      queryClient.invalidateQueries(["institutions"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create institution"
      );
    },
  });
};

export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation(institutionService.update, {
    onSuccess: () => {
      toast.success("Institution updated successfully");
      queryClient.invalidateQueries(["institutions"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update institution"
      );
    },
  });
};

export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation(institutionService.delete, {
    onSuccess: () => {
      toast.success("Institution deleted successfully");
      queryClient.invalidateQueries(["institutions"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete institution"
      );
    },
  });
};