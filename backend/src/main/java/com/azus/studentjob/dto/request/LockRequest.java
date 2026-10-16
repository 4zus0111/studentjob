package com.azus.studentjob.dto.request;

import jakarta.validation.constraints.NotNull;

public record LockRequest(
        @NotNull(message = "is required")
        Boolean locked
) {
}
