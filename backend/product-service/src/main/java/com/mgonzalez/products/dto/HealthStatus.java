package com.mgonzalez.products.dto;

import java.time.Instant;

public record HealthStatus(
        String service,
        String status,
        Instant timestamp
) {};