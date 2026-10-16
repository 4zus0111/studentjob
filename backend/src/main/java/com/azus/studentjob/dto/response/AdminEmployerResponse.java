package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.EmployerProfile;
import com.azus.studentjob.enums.UserStatus;

import java.time.LocalDateTime;

public record AdminEmployerResponse(
        Long userId,
        String email,
        UserStatus status,
        Long employerId,
        String companyName,
        String website,
        String address,
        LocalDateTime createdAt
) {

    public static AdminEmployerResponse from(EmployerProfile profile) {
        return new AdminEmployerResponse(
                profile.getUser().getId(),
                profile.getUser().getEmail(),
                profile.getUser().getStatus(),
                profile.getId(),
                profile.getCompanyName(),
                profile.getWebsite(),
                profile.getAddress(),
                profile.getUser().getCreatedAt());
    }
}
