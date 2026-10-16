package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.Job;
import com.azus.studentjob.enums.JobStatus;
import com.azus.studentjob.enums.JobType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record JobResponse(
        Long id,
        String title,
        String description,
        String requirements,
        Long salaryMin,
        Long salaryMax,
        String location,
        JobType jobType,
        LocalDate deadline,
        JobStatus status,
        CategoryResponse category,
        Long employerId,
        String companyName,
        String companyLogoUrl,
        LocalDateTime createdAt
) {

    public static JobResponse from(Job job) {
        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getRequirements(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getLocation(),
                job.getJobType(),
                job.getDeadline(),
                job.getStatus(),
                CategoryResponse.from(job.getCategory()),
                job.getEmployer().getId(),
                job.getEmployer().getCompanyName(),
                job.getEmployer().getLogoUrl(),
                job.getCreatedAt());
    }
}
