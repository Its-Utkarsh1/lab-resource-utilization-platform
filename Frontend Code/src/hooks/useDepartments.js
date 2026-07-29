import { useQuery } from "react-query";
import departmentService from "../services/departmentService";

export const useDepartments = (institutionCode) => {
  return useQuery(
    ["departments", institutionCode],
    () => departmentService.getByInstitution(institutionCode),
    {
      enabled: !!institutionCode,
    }
  );
};