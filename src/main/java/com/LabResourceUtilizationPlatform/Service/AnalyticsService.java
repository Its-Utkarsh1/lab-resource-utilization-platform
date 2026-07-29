package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Dtos.Response.*;

import java.util.List;

public interface AnalyticsService {

    // Dashboard Summary
    AnalyticsDashboardResponse getSystemAnalytics();

    AnalyticsDashboardResponse getInstitutionAnalytics();

    AnalyticsDashboardResponse getLabAnalytics();

    // Revenue
    List<RevenueResponse> getRevenueByEquipment();

    List<RevenueResponse> getRevenueByLab();

    // Equipment Usage
    List<EquipmentUsageResponse> getEquipmentUsage();

    List<TopEquipmentResponse> getTopUsedEquipment();

    List<TopEquipmentResponse> getLeastUsedEquipment();

    // Booking Analytics
    List<MonthlyBookingResponse> getMonthlyBookings();

    List<BookingTrendResponse> getBookingTrend();

    // Waiting Queue
    List<WaitingQueueAnalyticsResponse> getWaitingQueueAnalytics();
}