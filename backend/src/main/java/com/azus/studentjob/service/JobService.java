package com.azus.studentjob.service;

import com.azus.studentjob.dto.request.JobRequest;
import com.azus.studentjob.dto.response.JobResponse;
import com.azus.studentjob.dto.response.PageResponse;
import com.azus.studentjob.entity.Category;
import com.azus.studentjob.entity.EmployerProfile;
import com.azus.studentjob.entity.Job;
import com.azus.studentjob.enums.JobStatus;
import com.azus.studentjob.enums.JobType;
import com.azus.studentjob.exception.BadRequestException;
import com.azus.studentjob.exception.ConflictException;
import com.azus.studentjob.exception.ForbiddenException;
import com.azus.studentjob.exception.ResourceNotFoundException;
import com.azus.studentjob.repository.ApplicationRepository;
import com.azus.studentjob.repository.CategoryRepository;
import com.azus.studentjob.repository.JobRepository;
import com.azus.studentjob.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class JobService {

    private static final Set<String> SORTABLE = Set.of("createdAt", "title", "deadline", "salaryMin", "salaryMax");

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final ApplicationRepository applicationRepository;
    private final EmployerService employerService;

    // ---- Public ---------------------------------------------------------------------------

    /** Public search: only OPEN jobs whose deadline has not passed. All filters are optional. */
    @Transactional(readOnly = true)
    public PageResponse<JobResponse> search(String keyword, Long categoryId, JobType jobType,
                                            String location, Long salaryMin, Pageable pageable) {
        final LocalDate today = LocalDate.now();
        Specification<Job> spec = (root, query, cb) -> cb.and(
                cb.equal(root.get("status"), JobStatus.OPEN),
                cb.greaterThanOrEqualTo(root.<LocalDate>get("deadline"), today));

        if (keyword != null && !keyword.isBlank()) {
            final String like = "%" + keyword.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.<String>get("title")), like),
                    cb.like(cb.lower(root.get("employer").<String>get("companyName")), like)));
        }
        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }
        if (jobType != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("jobType"), jobType));
        }
        if (location != null && !location.isBlank()) {
            final String like = "%" + location.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.<String>get("location")), like));
        }
        if (salaryMin != null) {
            // The job pays at least salaryMin: its upper bound reaches it (or only a lower bound is given)
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.greaterThanOrEqualTo(root.<Long>get("salaryMax"), salaryMin),
                    cb.and(cb.isNull(root.get("salaryMax")),
                            cb.greaterThanOrEqualTo(root.<Long>get("salaryMin"), salaryMin))));
        }

        return PageResponse.from(jobRepository.findAll(spec, PageUtils.sanitize(pageable, SORTABLE))
                .map(JobResponse::from));
    }

    /** Hidden jobs are not found. Closed / expired jobs stay viewable (students still see them in their applications). */
    @Transactional(readOnly = true)
    public JobResponse getPublicJob(Long id) {
        Job job = jobRepository.findById(id)
                .filter(j -> j.getStatus() != JobStatus.HIDDEN)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return JobResponse.from(job);
    }

    // ---- Employer -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public PageResponse<JobResponse> listMyJobs(Long userId, Pageable pageable) {
        EmployerProfile employer = employerService.findProfile(userId);
        return PageResponse.from(jobRepository
                .findByEmployerId(employer.getId(), PageUtils.sanitize(pageable, SORTABLE))
                .map(JobResponse::from));
    }

    @Transactional
    public JobResponse createJob(Long userId, JobRequest request) {
        EmployerProfile employer = employerService.findProfile(userId);
        employerService.requireApproved(employer);
        validateSalary(request);

        Job job = Job.builder()
                .employer(employer)
                .category(findCategory(request.categoryId()))
                .title(request.title().trim())
                .description(request.description().trim())
                .requirements(blankToNull(request.requirements()))
                .salaryMin(request.salaryMin())
                .salaryMax(request.salaryMax())
                .location(blankToNull(request.location()))
                .jobType(request.jobType())
                .deadline(request.deadline())
                .status(JobStatus.OPEN)
                .build();
        return JobResponse.from(jobRepository.save(job));
    }

    @Transactional
    public JobResponse updateJob(Long userId, Long jobId, JobRequest request) {
        EmployerProfile employer = employerService.findProfile(userId);
        employerService.requireApproved(employer);
        Job job = findOwnedJob(employer, jobId);
        validateSalary(request);

        job.setCategory(findCategory(request.categoryId()));
        job.setTitle(request.title().trim());
        job.setDescription(request.description().trim());
        job.setRequirements(blankToNull(request.requirements()));
        job.setSalaryMin(request.salaryMin());
        job.setSalaryMax(request.salaryMax());
        job.setLocation(blankToNull(request.location()));
        job.setJobType(request.jobType());
        job.setDeadline(request.deadline());

        // An employer may only switch between OPEN and CLOSED; HIDDEN belongs to admins
        if (request.status() != null && request.status() != job.getStatus()) {
            if (request.status() == JobStatus.HIDDEN) {
                throw new BadRequestException("Only an admin can hide a job");
            }
            if (job.getStatus() == JobStatus.HIDDEN) {
                throw new ForbiddenException("This job has been hidden by an admin");
            }
            job.setStatus(request.status());
        }
        return JobResponse.from(job);
    }

    @Transactional
    public void deleteJob(Long userId, Long jobId) {
        EmployerProfile employer = employerService.findProfile(userId);
        employerService.requireApproved(employer);
        Job job = findOwnedJob(employer, jobId);
        if (applicationRepository.existsByJobId(jobId)) {
            throw new ConflictException("This job already has applications; close it instead of deleting it");
        }
        jobRepository.delete(job);
    }

    /** Ownership check shared with ApplicationService: the job must belong to the given employer. */
    public Job findOwnedJob(EmployerProfile employer, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new ForbiddenException("You can only manage your own jobs");
        }
        return job;
    }

    private Category findCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BadRequestException("Category does not exist"));
    }

    private void validateSalary(JobRequest request) {
        if (request.salaryMin() != null && request.salaryMax() != null
                && request.salaryMax() < request.salaryMin()) {
            throw new BadRequestException("Maximum salary must not be lower than minimum salary");
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
