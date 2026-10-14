package com.azus.studentjob.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterEmployerRequest(
        @NotBlank(message = "must not be blank")
        @Email(message = "must be a valid email")
        @Size(max = 255, message = "must be at most 255 characters")
        String email,

        @NotBlank(message = "must not be blank")
        @Size(min = 6, max = 72, message = "must be between 6 and 72 characters")
        String password,

        @NotBlank(message = "must not be blank")
        @Size(max = 255, message = "must be at most 255 characters")
        String companyName
) {
}
