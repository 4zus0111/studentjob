package com.azus.studentjob.dto.request;

import jakarta.validation.constraints.NotNull;

public record VisibilityRequest(
        @NotNull(message = "is required")
        Boolean hidden
) {
}
