package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.EmployerProfile;
import com.azus.studentjob.enums.UserStatus;

/** {@code status} is the account status: PENDING_APPROVAL until an admin approves the employer. */
public record EmployerProfileResponse(
        Long id,
        String email,
        UserStatus status,
        String companyName,
        String description,
        String website,
        String address,
        String logoUrl
) {

    public static EmployerProfileResponse from(EmployerProfile profile) {
        return new EmployerProfileResponse(
                profile.getId(),
                profile.getUser().getEmail(),
                profile.getUser().getStatus(),
                profile.getCompanyName(),
                profile.getDescription(),
                profile.getWebsite(),
                profile.getAddress(),
                profile.getLogoUrl());
    }
}
