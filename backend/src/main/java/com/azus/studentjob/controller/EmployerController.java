package com.azus.studentjob.controller;

import com.azus.studentjob.config.OpenApiConfig;
import com.azus.studentjob.dto.request.JobRequest;
import com.azus.studentjob.dto.request.UpdateEmployerProfileRequest;
import com.azus.studentjob.dto.response.ApiResponse;
import com.azus.studentjob.dto.response.ApplicantResponse;
import com.azus.studentjob.dto.response.EmployerProfileResponse;
import com.azus.studentjob.dto.response.JobResponse;
import com.azus.studentjob.dto.response.PageResponse;
import com.azus.studentjob.security.CustomUserDetails;
import com.azus.studentjob.service.ApplicationService;
import com.azus.studentjob.service.EmployerService;
import com.azus.studentjob.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employers/me")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYER')")
@Tag(name = "Employer")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class EmployerController {

    private final EmployerService employerService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    @GetMapping
    @Operation(summary = "Get my company profile")
    public ResponseEntity<ApiResponse<EmployerProfileResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.ok(employerService.getProfile(principal.getId()), "OK"));
    }

    @PutMapping
    @Operation(summary = "Update my company profile")
    public ResponseEntity<ApiResponse<EmployerProfileResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody UpdateEmployerProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                employerService.updateProfile(principal.getId(), request), "Profile updated"));
    }

    @GetMapping("/jobs")
    @Operation(summary = "List my job postings (any status)")
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>> listJobs(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.listMyJobs(principal.getId(), pageable), "OK"));
    }

    @PostMapping("/jobs")
    @Operation(summary = "Create a job posting (approved employers only)")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.createJob(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(job, "Job created"));
    }

    @PutMapping("/jobs/{id}")
    @Operation(summary = "Update one of my job postings")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.updateJob(principal.getId(), id, request), "Job updated"));
    }

    @DeleteMapping("/jobs/{id}")
    @Operation(summary = "Delete one of my job postings (only if it has no applications)")
    public ResponseEntity<Void> deleteJob(@AuthenticationPrincipal CustomUserDetails principal, @PathVariable Long id) {
        jobService.deleteJob(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/jobs/{id}/applications")
    @Operation(summary = "List applicants of one of my job postings")
    public ResponseEntity<ApiResponse<PageResponse<ApplicantResponse>>> listApplicants(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long id,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                applicationService.listApplicants(principal.getId(), id, pageable), "OK"));
    }
}
