package com.azus.studentjob.service;

import com.azus.studentjob.dto.request.UpdateEmployerProfileRequest;
import com.azus.studentjob.dto.response.EmployerProfileResponse;
import com.azus.studentjob.entity.EmployerProfile;
import com.azus.studentjob.enums.UserStatus;
import com.azus.studentjob.exception.ForbiddenException;
import com.azus.studentjob.exception.ResourceNotFoundException;
import com.azus.studentjob.repository.EmployerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerProfileRepository employerProfileRepository;

    @Transactional(readOnly = true)
    public EmployerProfileResponse getProfile(Long userId) {
        return EmployerProfileResponse.from(findProfile(userId));
    }

    /** Allowed while the account is still PENDING_APPROVAL, so the company can prepare its profile. */
    @Transactional
    public EmployerProfileResponse updateProfile(Long userId, UpdateEmployerProfileRequest request) {
        EmployerProfile profile = findProfile(userId);
        profile.setCompanyName(request.companyName().trim());
        profile.setDescription(blankToNull(request.description()));
        profile.setWebsite(blankToNull(request.website()));
        profile.setAddress(blankToNull(request.address()));
        profile.setLogoUrl(blankToNull(request.logoUrl()));
        return EmployerProfileResponse.from(profile);
    }

    /** Also used by JobService / ApplicationService. */
    public EmployerProfile findProfile(Long userId) {
        return employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer profile not found"));
    }

    /** Business rule: an employer must be approved by an admin before posting jobs. */
    public void requireApproved(EmployerProfile employer) {
        if (employer.getUser().getStatus() != UserStatus.ACTIVE) {
            throw new ForbiddenException("Your employer account has not been approved yet");
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
