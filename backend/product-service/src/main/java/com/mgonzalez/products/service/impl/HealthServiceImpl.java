package com.mgonzalez.products.service.impl;

import com.mgonzalez.products.dto.HealthStatus;
import com.mgonzalez.products.service.HealthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class HealthServiceImpl implements HealthService {

    @Value("${spring.application.name}")
    private String serviceName;

    @Override
    public HealthStatus checkHealth() {
        return new HealthStatus(
                serviceName,
                "UP",
                Instant.now()
        );
    }

}
