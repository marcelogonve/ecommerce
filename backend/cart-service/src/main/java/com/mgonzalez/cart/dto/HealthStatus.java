package com.mgonzalez.cart.dto;

import java.time.Instant;

public record HealthStatus(
        String service,
        String status,
        Instant timestamp
) {}
