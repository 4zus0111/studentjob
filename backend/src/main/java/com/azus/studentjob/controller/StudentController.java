package com.azus.studentjob.controller;

import com.azus.studentjob.config.OpenApiConfig;
import com.azus.studentjob.dto.request.UpdateStudentProfileRequest;
import com.azus.studentjob.dto.response.ApiResponse;
import com.azus.studentjob.dto.response.MyApplicationResponse;
import com.azus.studentjob.dto.response.PageResponse;
import com.azus.studentjob.dto.response.StudentProfileResponse;
import com.azus.studentjob.security.CustomUserDetails;
import com.azus.studentjob.service.ApplicationService;
import com.azus.studentjob.service.StudentService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students/me")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class StudentController {

    private final StudentService studentService;
    private final ApplicationService applicationService;

    @GetMapping
    @Operation(summary = "Get my student profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.getProfile(principal.getId()), "OK"));
    }

    @PutMapping
    @Operation(summary = "Update my student profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody UpdateStudentProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                studentService.updateProfile(principal.getId(), request), "Profile updated"));
    }

    @GetMapping("/applications")
    @Operation(summary = "List my applications and their statuses")
    public ResponseEntity<ApiResponse<PageResponse<MyApplicationResponse>>> myApplications(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                applicationService.listMyApplications(principal.getId(), pageable), "OK"));
    }
}
