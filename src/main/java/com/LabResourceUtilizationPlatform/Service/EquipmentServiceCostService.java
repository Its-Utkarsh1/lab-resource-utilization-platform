package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Entity.EquipmentServiceCost;

public interface EquipmentServiceCostService {

    EquipmentServiceCost calculateCost(Long bookingId);

    EquipmentServiceCost updateCost(Long bookingId);
}