package com.azus.studentjob.dto.request;

import com.azus.studentjob.enums.JobStatus;
import com.azus.studentjob.enums.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Create / update a job posting. {@code status} is optional: an employer can only choose OPEN or CLOSED
 * (HIDDEN is reserved for admins). It is ignored on create (new jobs are always OPEN).
 */
public record JobRequest(
        @NotBlank(message = "must not be blank")
        @Size(max = 255, message = "must be at most 255 characters")
        String title,

        @NotBlank(message = "must not be blank")
        @Size(max = 10000, message = "must be at most 10000 characters")
        String description,

        @Size(max = 10000, message = "must be at most 10000 characters")
        String requirements,

        @PositiveOrZero(message = "must not be negative")
        Long salaryMin,

        @PositiveOrZero(message = "must not be negative")
        Long salaryMax,

        @Size(max = 255, message = "must be at most 255 characters")
        String location,

        @NotNull(message = "is required")
        JobType jobType,

        // "Not in the past" is checked in JobService, and only when the deadline changes,
        // so an employer can still close or edit a job whose deadline has already passed.
        @NotNull(message = "is required")
        LocalDate deadline,

        @NotNull(message = "is required")
        Long categoryId,

        JobStatus status
) {
}
