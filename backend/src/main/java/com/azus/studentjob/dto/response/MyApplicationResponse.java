package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.Application;
import com.azus.studentjob.enums.ApplicationStatus;
import com.azus.studentjob.enums.JobStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** An application as the student who sent it sees it. */
public record MyApplicationResponse(
        Long id,
        ApplicationStatus status,
        String coverLetter,
        LocalDateTime createdAt,
        Long jobId,
        String jobTitle,
        JobStatus jobStatus,
        LocalDate jobDeadline,
        String companyName
) {

    public static MyApplicationResponse from(Application application) {
        return new MyApplicationResponse(
                application.getId(),
                application.getStatus(),
                application.getCoverLetter(),
                application.getCreatedAt(),
                application.getJob().getId(),
                application.getJob().getTitle(),
                application.getJob().getStatus(),
                application.getJob().getDeadline(),
                application.getJob().getEmployer().getCompanyName());
    }
}
