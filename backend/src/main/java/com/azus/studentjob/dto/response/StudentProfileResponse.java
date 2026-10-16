package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.StudentProfile;

public record StudentProfileResponse(
        Long id,
        String email,
        String fullName,
        String phone,
        String university,
        String major,
        String skills,
        String cvUrl
) {

    public static StudentProfileResponse from(StudentProfile profile) {
        return new StudentProfileResponse(
                profile.getId(),
                profile.getUser().getEmail(),
                profile.getFullName(),
                profile.getPhone(),
                profile.getUniversity(),
                profile.getMajor(),
                profile.getSkills(),
                profile.getCvUrl());
    }
}
