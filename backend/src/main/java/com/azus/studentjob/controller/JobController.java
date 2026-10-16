package com.azus.studentjob.controller;

import com.azus.studentjob.dto.response.ApiResponse;
import com.azus.studentjob.dto.response.JobResponse;
import com.azus.studentjob.dto.response.PageResponse;
import com.azus.studentjob.enums.JobType;
import com.azus.studentjob.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs (public)")
public class JobController {

    private final JobService jobService;

    @GetMapping
    @Operation(summary = "Search open jobs (public). Expired and hidden jobs are never returned")
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long salaryMin,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                jobService.search(keyword, categoryId, jobType, location, salaryMin, pageable), "OK"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Job detail (public). Hidden jobs return 404")
    public ResponseEntity<ApiResponse<JobResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getPublicJob(id), "OK"));
    }
}
