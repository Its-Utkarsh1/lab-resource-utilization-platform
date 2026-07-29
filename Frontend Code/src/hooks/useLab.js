import { useQuery } from "react-query";
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