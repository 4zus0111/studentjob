package com.azus.studentjob.controller;

import com.azus.studentjob.config.OpenApiConfig;
import com.azus.studentjob.dto.request.ApprovalRequest;
import com.azus.studentjob.dto.request.LockRequest;
import com.azus.studentjob.dto.request.VisibilityRequest;
import com.azus.studentjob.dto.response.AdminEmployerResponse;
import com.azus.studentjob.dto.response.AdminUserResponse;
import com.azus.studentjob.dto.response.ApiResponse;
import com.azus.studentjob.dto.response.JobResponse;
import com.azus.studentjob.dto.response.PageResponse;
import com.azus.studentjob.enums.JobStatus;
import com.azus.studentjob.enums.Role;
import com.azus.studentjob.enums.UserStatus;
import com.azus.studentjob.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/employers")
    @Operation(summary = "List employers, optionally filtered by account status (e.g. PENDING_APPROVAL)")
    public ResponseEntity<ApiResponse<PageResponse<AdminEmployerResponse>>> listEmployers(
            @RequestParam(required = false) UserStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.listEmployers(status, pageable), "OK"));
    }

    @PatchMapping("/employers/{userId}/approval")
    @Operation(summary = "Approve (-> ACTIVE) or reject (-> LOCKED) a pending employer")
    public ResponseEntity<ApiResponse<AdminEmployerResponse>> decideEmployer(
            @PathVariable Long userId, @Valid @RequestBody ApprovalRequest request) {
        String message = request.approved() ? "Employer approved" : "Employer rejected";
        return ResponseEntity.ok(ApiResponse.ok(adminService.decideEmployer(userId, request.approved()), message));
    }

    @GetMapping("/jobs")
    @Operation(summary = "List all jobs including hidden ones, optionally filtered by status")
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>> listJobs(
            @RequestParam(required = false) JobStatus status,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.listJobs(status, pageable), "OK"));
    }

    @PatchMapping("/jobs/{id}/visibility")
    @Operation(summary = "Hide (hidden=true) or unhide (hidden=false) a job")
    public ResponseEntity<ApiResponse<JobResponse>> setVisibility(
            @PathVariable Long id, @Valid @RequestBody VisibilityRequest request) {
        String message = request.hidden() ? "Job hidden" : "Job visible again";
        return ResponseEntity.ok(ApiResponse.ok(adminService.setJobHidden(id, request.hidden()), message));
    }

    @GetMapping("/users")
    @Operation(summary = "List users, optionally filtered by role")
    public ResponseEntity<ApiResponse<PageResponse<AdminUserResponse>>> listUsers(
            @RequestParam(required = false) Role role,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.listUsers(role, pageable), "OK"));
    }

    @PatchMapping("/users/{id}/lock")
    @Operation(summary = "Lock (locked=true) or unlock (locked=false) a user account")
    public ResponseEntity<ApiResponse<AdminUserResponse>> setLocked(
            @PathVariable Long id, @Valid @RequestBody LockRequest request) {
        String message = request.locked() ? "User locked" : "User unlocked";
        return ResponseEntity.ok(ApiResponse.ok(adminService.setUserLocked(id, request.locked()), message));
    }
}
