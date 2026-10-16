package com.azus.studentjob.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Full replacement of the company profile (PUT). Blank optional fields are stored as null. */
public record UpdateEmployerProfileRequest(
        @NotBlank(message = "must not be blank")
        @Size(max = 255, message = "must be at most 255 characters")
        String companyName,

        @Size(max = 5000, message = "must be at most 5000 characters")
        String description,

        @Size(max = 500, message = "must be at most 500 characters")
        @Pattern(regexp = "^(https?://\\S+)?$", message = "must be a valid http(s) URL")
        String website,

        @Size(max = 255, message = "must be at most 255 characters")
        String address,

        @Size(max = 500, message = "must be at most 500 characters")
        @Pattern(regexp = "^(https?://\\S+)?$", message = "must be a valid http(s) URL")
        String logoUrl
) {
}
