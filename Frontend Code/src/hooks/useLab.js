import {
  useQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import toast from "react-hot-toast";
import labService from "../services/labService";

export const useLabsByDepartment = (
  institutionCode,
  departmentName
) => {
  return useQuery(
    ["labs", institutionCode, departmentName],
    () =>
      labService.getByDepartment(
        institutionCode,
        departmentName
      ),
    {
      enabled: !!institutionCode && !!departmentName,
    }
  );
};

export const useCreateLab = () => {
  const queryClient = useQueryClient();

  return useMutation(labService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(["labs"]);
      toast.success("Lab created successfully.");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
        "Failed to create lab."
      );
    },
  });
};