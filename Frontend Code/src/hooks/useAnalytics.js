import { useQuery } from "react-query";
import analyticsService from "../services/analyticsService";

export const useSystemAnalytics = (enabled = true) => {
  return useQuery(
    "system-analytics",
    analyticsService.getSystemAnalytics,
    {
      enabled,
    }
  );
};

export const useInstitutionAnalytics = (enabled = true) => {
  return useQuery(
    "institution-analytics",
    analyticsService.getInstitutionAnalytics,
    {
      enabled,
    }
  );
};

export const useLabAnalytics = (enabled = true) => {
  return useQuery(
    "lab-analytics",
    analyticsService.getLabAnalytics,
    {
      enabled,
    }
  );
};

export const useRevenueByEquipment = () => {
  return useQuery(
    "revenue-equipment",
    analyticsService.getRevenueByEquipment
  );
};

export const useRevenueByLab = () => {
  return useQuery(
    "revenue-lab",
    analyticsService.getRevenueByLab
  );
};

export const useEquipmentUsage = () => {
  return useQuery(
    "equipment-usage",
    analyticsService.getEquipmentUsage
  );
};

export const useTopEquipment = () => {
  return useQuery(
    "top-equipment",
    analyticsService.getTopEquipment
  );
};

export const useLeastEquipment = () => {
  return useQuery(
    "least-equipment",
    analyticsService.getLeastEquipment
  );
};

export const useMonthlyBookings = () => {
  return useQuery(
    "monthly-bookings",
    analyticsService.getMonthlyBookings
  );
};

export const useBookingTrend = () => {
  return useQuery(
    "booking-trend",
    analyticsService.getBookingTrend
  );
};

export const useWaitingQueueAnalytics = () => {
  return useQuery(
    "waiting-queue",
    analyticsService.getWaitingQueueAnalytics
  );
};