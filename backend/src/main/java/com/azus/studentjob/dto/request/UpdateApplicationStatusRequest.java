package com.azus.studentjob.dto.request;

import com.azus.studentjob.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

/** Only ACCEPTED or REJECTED are accepted by the service. */
public record UpdateApplicationStatusRequest(
        @NotNull(message = "is required")
        ApplicationStatus status
) {
}
