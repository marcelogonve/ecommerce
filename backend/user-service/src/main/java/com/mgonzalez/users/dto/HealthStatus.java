package com.mgonzalez.users.dto;

import java.time.Instant;

public record HealthStatus(
        String service,
        String status,
        Instant timestamp
) {}
