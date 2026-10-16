package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.Application;
import com.azus.studentjob.entity.StudentProfile;
import com.azus.studentjob.enums.ApplicationStatus;

import java.time.LocalDateTime;

/** An application as the employer who owns the job sees it (includes the applicant's profile). */
public record ApplicantResponse(
        Long id,
        ApplicationStatus status,
        String coverLetter,
        LocalDateTime createdAt,
        Long jobId,
        Long studentId,
        String fullName,
        String email,
        String phone,
        String university,
        String major,
        String skills,
        String cvUrl
) {

    public static ApplicantResponse from(Application application) {
        StudentProfile student = application.getStudent();
        return new ApplicantResponse(
                application.getId(),
                application.getStatus(),
                application.getCoverLetter(),
                application.getCreatedAt(),
                application.getJob().getId(),
                student.getId(),
                student.getFullName(),
                student.getUser().getEmail(),
                student.getPhone(),
                student.getUniversity(),
                student.getMajor(),
                student.getSkills(),
                student.getCvUrl());
    }
}
