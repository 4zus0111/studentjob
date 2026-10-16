package com.azus.studentjob.dto.request;

import jakarta.validation.constraints.Size;

public record ApplyRequest(
        @Size(max = 5000, message = "must be at most 5000 characters")
        String coverLetter
) {
}
