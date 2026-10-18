package com.azus.studentjob.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "must not be blank")
        String currentPassword,

        // BCrypt only uses the first 72 bytes
        @NotBlank(message = "must not be blank")
        @Size(min = 6, max = 72, message = "must be between 6 and 72 characters")
        String newPassword
) {
}
