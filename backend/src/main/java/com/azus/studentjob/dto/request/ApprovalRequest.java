package com.azus.studentjob.dto.request;

import jakarta.validation.constraints.NotNull;

public record ApprovalRequest(
        @NotNull(message = "is required")
        Boolean approved
) {
}
