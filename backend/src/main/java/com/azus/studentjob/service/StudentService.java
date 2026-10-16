package com.azus.studentjob.service;

import com.azus.studentjob.dto.request.UpdateStudentProfileRequest;
import com.azus.studentjob.dto.response.StudentProfileResponse;
import com.azus.studentjob.entity.StudentProfile;
import com.azus.studentjob.exception.ResourceNotFoundException;
import com.azus.studentjob.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfile(Long userId) {
        return StudentProfileResponse.from(findProfile(userId));
    }

    @Transactional
    public StudentProfileResponse updateProfile(Long userId, UpdateStudentProfileRequest request) {
        StudentProfile profile = findProfile(userId);
        profile.setFullName(request.fullName().trim());
        profile.setPhone(blankToNull(request.phone()));
        profile.setUniversity(blankToNull(request.university()));
        profile.setMajor(blankToNull(request.major()));
        profile.setSkills(blankToNull(request.skills()));
        profile.setCvUrl(blankToNull(request.cvUrl()));
        return StudentProfileResponse.from(profile);
    }

    /** Also used by ApplicationService. */
    public StudentProfile findProfile(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
