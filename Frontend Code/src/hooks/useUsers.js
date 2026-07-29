import { useQuery } from "react-query";
import userService from "../services/userService";

export const useLabTechnicians = () => {
  return useQuery(
    ["lab-technicians"],
    userService.getLabTechnicians
  );
};
export const useUsersByDepartment = (
  institutionCode,
  departmentName
) => {
  return useQuery(
    ["users", institutionCode, departmentName],
    () =>
      userService.getUsersByDepartment(
        institutionCode,
        departmentName
      ),
    {
      enabled: !!institutionCode && !!departmentName,
    }
  );
};