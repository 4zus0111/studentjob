package com.azus.studentjob.controller;

import com.azus.studentjob.dto.JobRequest;
import com.azus.studentjob.entity.Job;
import com.azus.studentjob.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // CREATE
    @PostMapping
    public ResponseEntity<Job> create(
            @Valid @RequestBody JobRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(jobService.create(request));
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Job>> getAll() {

        return ResponseEntity.ok(
                jobService.getAll()
        );
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Job> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                jobService.getById(id)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Job> update(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request) {

        return ResponseEntity.ok(
                jobService.update(id, request)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        jobService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
