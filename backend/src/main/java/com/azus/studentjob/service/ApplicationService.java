package com.azus.studentjob.service;

import com.azus.studentjob.dto.request.ApplyRequest;
import com.azus.studentjob.dto.request.UpdateApplicationStatusRequest;
import com.azus.studentjob.dto.response.ApplicantResponse;
import com.azus.studentjob.dto.response.MyApplicationResponse;
import com.azus.studentjob.dto.response.PageResponse;
import com.azus.studentjob.entity.Application;
import com.azus.studentjob.entity.EmployerProfile;
import com.azus.studentjob.entity.Job;
import com.azus.studentjob.entity.StudentProfile;
import com.azus.studentjob.enums.ApplicationStatus;
import com.azus.studentjob.enums.JobStatus;
import com.azus.studentjob.exception.BadRequestException;
import com.azus.studentjob.exception.ConflictException;
import com.azus.studentjob.exception.ForbiddenException;
import com.azus.studentjob.exception.ResourceNotFoundException;
import com.azus.studentjob.repository.ApplicationRepository;
import com.azus.studentjob.repository.JobRepository;
import com.azus.studentjob.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private static final Set<String> SORTABLE = Set.of("createdAt", "status");

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentService studentService;
    private final EmployerService employerService;
    private final JobService jobService;

    // ---- Student --------------------------------------------------------------------------

    @Transactional
    public MyApplicationResponse apply(Long userId, Long jobId, ApplyRequest request) {
        StudentProfile student = studentService.findProfile(userId);

        Job job = jobRepository.findById(jobId)
                .filter(j -> j.getStatus() != JobStatus.HIDDEN)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException("This job is no longer accepting applications");
        }
        if (job.getDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("The application deadline has passed");
        }
        if (applicationRepository.existsByJobIdAndStudentId(jobId, student.getId())) {
            throw new ConflictException("You have already applied to this job");
        }

        String coverLetter = request == null ? null : request.coverLetter();
        Application application = applicationRepository.save(Application.builder()
                .job(job)
                .student(student)
                .coverLetter(coverLetter == null || coverLetter.isBlank() ? null : coverLetter.trim())
                .status(ApplicationStatus.PENDING)
                .build());
        return MyApplicationResponse.from(application);
    }

    @Transactional(readOnly = true)
    public PageResponse<MyApplicationResponse> listMyApplications(Long userId, Pageable pageable) {
        StudentProfile student = studentService.findProfile(userId);
        return PageResponse.from(applicationRepository
                .findByStudentId(student.getId(), PageUtils.sanitize(pageable, SORTABLE))
                .map(MyApplicationResponse::from));
    }

    // ---- Employer -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<ApplicantResponse> listApplicants(Long userId, Long jobId, Pageable pageable) {
        EmployerProfile employer = employerService.findProfile(userId);
        jobService.findOwnedJob(employer, jobId); // 404 / 403 checks
        return PageResponse.from(applicationRepository
                .findByJobId(jobId, PageUtils.sanitize(pageable, SORTABLE))
                .map(ApplicantResponse::from));
    }

    /** PENDING -> ACCEPTED or PENDING -> REJECTED; no other transitions. */
    @Transactional
    public ApplicantResponse updateStatus(Long userId, Long applicationId, UpdateApplicationStatusRequest request) {
        EmployerProfile employer = employerService.findProfile(userId);
        employerService.requireApproved(employer);

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!application.getJob().getEmployer().getId().equals(employer.getId())) {
            throw new ForbiddenException("You can only review applications for your own jobs");
        }
        if (request.status() == ApplicationStatus.PENDING) {
            throw new BadRequestException("Status must be ACCEPTED or REJECTED");
        }
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ConflictException("This application has already been " + application.getStatus().name().toLowerCase());
        }
        application.setStatus(request.status());
        return ApplicantResponse.from(application);
    }
}
