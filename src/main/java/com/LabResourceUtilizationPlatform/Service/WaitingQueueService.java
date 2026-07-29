package com.LabResourceUtilizationPlatform.Service;

import com.LabResourceUtilizationPlatform.Dtos.Request.CreateBookingRequest;
import com.LabResourceUtilizationPlatform.Dtos.Response.WaitingQueueResponse;
import com.LabResourceUtilizationPlatform.Entity.Equipment;
import com.LabResourceUtilizationPlatform.Entity.User;

import java.util.List;

public interface WaitingQueueService {

    void addToQueue(
            User user,
            Equipment equipment,
            CreateBookingRequest request
    );



    void allocateNextWaitingUser(Long equipmentId);

    void removeFromQueue(Long queueId);

    List<WaitingQueueResponse> getMyQueue();

    List<WaitingQueueResponse> getEquipmentQueue(Long equipmentId);

}