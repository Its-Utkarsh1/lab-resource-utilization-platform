import { useQuery } from "react-query";
import dashboardService from "../services/dashboardService";

export const useWeeklyUtilization = () =>
  useQuery(
    ["weekly-utilization"],
    dashboardService.getWeeklyUtilization
  );

export const useStudentDashboard = () =>
  useQuery(
    ["student-dashboard"],
    dashboardService.getStudentDashboard
  );

export const useResearcherDashboard = () =>
  useQuery(
    ["researcher-dashboard"],
    dashboardService.getResearcherDashboard
  );

export const useFacultyDashboard = () =>
  useQuery(
    ["faculty-dashboard"],
    dashboardService.getFacultyDashboard
  );

export const useTechnicianDashboard = () =>
  useQuery(
    ["technician-dashboard"],
    dashboardService.getTechnicianDashboard
  );

export const useLabManagerDashboard = () =>
  useQuery(
    ["lab-manager-dashboard"],
    dashboardService.getLabManagerDashboard
  );

export const useDepartmentHeadDashboard = () =>
  useQuery(
    ["department-head-dashboard"],
    dashboardService.getDepartmentHeadDashboard
  );

export const useInstitutionAdminDashboard = () =>
  useQuery(
    ["institution-admin-dashboard"],
    dashboardService.getInstitutionAdminDashboard
  );

export const useSystemAdminDashboard = () =>
  useQuery(
    ["system-admin-dashboard"],
    dashboardService.getSystemAdminDashboard
  );