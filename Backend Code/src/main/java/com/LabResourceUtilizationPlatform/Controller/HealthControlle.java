package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final long startTime = System.currentTimeMillis();

    @GetMapping("/health")
    public Map<String, Object> health() {

        long uptime = System.currentTimeMillis() - startTime;

        return Map.of(
                "status", "ok",
                "timestamp", Instant.now().toString(),
                "uptime", uptime
        );
    }
}
