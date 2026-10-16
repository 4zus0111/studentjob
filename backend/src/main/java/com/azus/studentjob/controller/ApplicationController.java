package com.azus.studentjob.controller;

import com.azus.studentjob.config.OpenApiConfig;
import com.azus.studentjob.dto.request.ApplyRequest;
import com.azus.studentjob.dto.request.UpdateApplicationStatusRequest;
import com.azus.studentjob.dto.response.ApiResponse;
import com.azus.studentjob.dto.response.ApplicantResponse;
import com.azus.studentjob.dto.response.MyApplicationResponse;
import com.azus.studentjob.security.CustomUserDetails;
import com.azus.studentjob.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Applications")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/jobs/{jobId}/applications")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Apply to a job (one application per job per student)")
    public ResponseEntity<ApiResponse<MyApplicationResponse>> apply(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long jobId,
            // The cover letter is optional, so the whole body may be omitted
            @Valid @RequestBody(required = false) ApplyRequest request) {
        MyApplicationResponse application = applicationService.apply(principal.getId(), jobId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(application, "Application submitted"));
    }

    @PatchMapping("/applications/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Accept or reject an application (PENDING only)")
    public ResponseEntity<ApiResponse<ApplicantResponse>> updateStatus(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                applicationService.updateStatus(principal.getId(), id, request), "Application updated"));
    }
}
