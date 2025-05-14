package com.mgonzalez.cart.controller;

import com.mgonzalez.cart.dto.HealthStatus;
import com.mgonzalez.cart.service.HealthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class PingController {

    private final HealthService healthService;

    public PingController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping("/ping")
    public ResponseEntity<HealthStatus> ping() {
        return ResponseEntity.ok(healthService.checkHealth());
    }

}
