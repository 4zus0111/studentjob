package com.azus.studentjob.service;

import com.azus.studentjob.dto.response.AdminEmployerResponse;
import com.azus.studentjob.dto.response.AdminUserResponse;
import com.azus.studentjob.dto.response.JobResponse;
import com.azus.studentjob.dto.response.PageResponse;
import com.azus.studentjob.entity.EmployerProfile;
import com.azus.studentjob.entity.Job;
import com.azus.studentjob.entity.User;
import com.azus.studentjob.enums.JobStatus;
import com.azus.studentjob.enums.Role;
import com.azus.studentjob.enums.UserStatus;
import com.azus.studentjob.exception.BadRequestException;
import com.azus.studentjob.exception.ConflictException;
import com.azus.studentjob.exception.ResourceNotFoundException;
import com.azus.studentjob.repository.EmployerProfileRepository;
import com.azus.studentjob.repository.JobRepository;
import com.azus.studentjob.repository.StudentProfileRepository;
import com.azus.studentjob.repository.UserRepository;
import com.azus.studentjob.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final Set<String> EMPLOYER_SORTABLE = Set.of("createdAt", "companyName");
    private static final Set<String> JOB_SORTABLE = Set.of("createdAt", "title", "deadline");
    private static final Set<String> USER_SORTABLE = Set.of("createdAt", "email");

    private final UserRepository userRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final JobRepository jobRepository;

    // ---- Employers ------------------------------------------------------------------------

    /** {@code status} is optional (e.g. PENDING_APPROVAL to see who is waiting). */
    @Transactional(readOnly = true)
    public PageResponse<AdminEmployerResponse> listEmployers(UserStatus status, Pageable pageable) {
        Pageable safe = PageUtils.sanitize(pageable, EMPLOYER_SORTABLE);
        var page = status == null
                ? employerProfileRepository.findAll(safe)
                : employerProfileRepository.findByUserStatus(status, safe);
        return PageResponse.from(page.map(AdminEmployerResponse::from));
    }

    /** Approve: PENDING_APPROVAL -> ACTIVE. Reject: PENDING_APPROVAL -> LOCKED (the account cannot log in). */
    @Transactional
    public AdminEmployerResponse decideEmployer(Long userId, boolean approved) {
        EmployerProfile profile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));
        User user = profile.getUser();
        if (user.getStatus() != UserStatus.PENDING_APPROVAL) {
            throw new ConflictException("This employer is not waiting for approval");
        }
        user.setStatus(approved ? UserStatus.ACTIVE : UserStatus.LOCKED);
        return AdminEmployerResponse.from(profile);
    }

    // ---- Jobs -----------------------------------------------------------------------------

    /** All jobs including hidden ones; {@code status} is optional. */
    @Transactional(readOnly = true)
    public PageResponse<JobResponse> listJobs(JobStatus status, Pageable pageable) {
        Pageable safe = PageUtils.sanitize(pageable, JOB_SORTABLE);
        var page = status == null ? jobRepository.findAll(safe) : jobRepository.findByStatus(status, safe);
        return PageResponse.from(page.map(JobResponse::from));
    }

    /** Hide: any status -> HIDDEN. Unhide: HIDDEN -> OPEN. */
    @Transactional
    public JobResponse setJobHidden(Long jobId, boolean hidden) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (hidden) {
            job.setStatus(JobStatus.HIDDEN);
        } else if (job.getStatus() == JobStatus.HIDDEN) {
            job.setStatus(JobStatus.OPEN);
        }
        return JobResponse.from(job);
    }

    // ---- Users ----------------------------------------------------------------------------

    /** {@code role} is optional. */
    @Transactional(readOnly = true)
    public PageResponse<AdminUserResponse> listUsers(Role role, Pageable pageable) {
        Pageable safe = PageUtils.sanitize(pageable, USER_SORTABLE);
        var page = role == null ? userRepository.findAll(safe) : userRepository.findByRole(role, safe);
        return PageResponse.from(page.map(user -> AdminUserResponse.from(user, displayName(user))));
    }

    /** Lock: -> LOCKED. Unlock: LOCKED -> ACTIVE. Admin accounts cannot be locked. */
    @Transactional
    public AdminUserResponse setUserLocked(Long userId, boolean locked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be locked");
        }
        if (locked) {
            user.setStatus(UserStatus.LOCKED);
        } else if (user.getStatus() == UserStatus.LOCKED) {
            user.setStatus(UserStatus.ACTIVE);
        }
        return AdminUserResponse.from(user, displayName(user));
    }

    private String displayName(User user) {
        return switch (user.getRole()) {
            case STUDENT -> studentProfileRepository.findByUserId(user.getId())
                    .map(p -> p.getFullName()).orElse(user.getEmail());
            case EMPLOYER -> employerProfileRepository.findByUserId(user.getId())
                    .map(p -> p.getCompanyName()).orElse(user.getEmail());
            case ADMIN -> user.getEmail();
        };
    }
}
