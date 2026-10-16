package com.azus.studentjob.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Full replacement of the student's profile (PUT). Blank optional fields are stored as null. */
public record UpdateStudentProfileRequest(
        @NotBlank(message = "must not be blank")
        @Size(max = 100, message = "must be at most 100 characters")
        String fullName,

        @Size(max = 20, message = "must be at most 20 characters")
        String phone,

        @Size(max = 255, message = "must be at most 255 characters")
        String university,

        @Size(max = 255, message = "must be at most 255 characters")
        String major,

        @Size(max = 2000, message = "must be at most 2000 characters")
        String skills,

        @Size(max = 500, message = "must be at most 500 characters")
        @Pattern(regexp = "^(https?://\\S+)?$", message = "must be a valid http(s) URL")
        String cvUrl
) {
}
