package com.LabResourceUtilizationPlatform.Controller;

import com.LabResourceUtilizationPlatform.Dtos.Response.WaitingQueueResponse;
import com.LabResourceUtilizationPlatform.Service.WaitingQueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/waiting-queue")
@RequiredArgsConstructor
public class WaitingQueueController {

    private final WaitingQueueService waitingQueueService;

    @GetMapping("/my")

    public ResponseEntity<List<WaitingQueueResponse>> myQueue() {

        return ResponseEntity.ok(
                waitingQueueService.getMyQueue()
        );
    }

    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<List<WaitingQueueResponse>> equipmentQueue(
            @PathVariable Long equipmentId) {

        return ResponseEntity.ok(
                waitingQueueService.getEquipmentQueue(equipmentId)
        );
    }

    @DeleteMapping("/{queueId}")
    public ResponseEntity<String> remove(
            @PathVariable Long queueId) {

        waitingQueueService.removeFromQueue(queueId);

        return ResponseEntity.ok("Removed from waiting queue.");
    }
}