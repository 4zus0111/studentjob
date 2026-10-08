package com.azus.studentjob.controller;

import com.azus.studentjob.dto.StudentRequest;
import com.azus.studentjob.entity.Student;
import com.azus.studentjob.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // CREATE
    @PostMapping
    public ResponseEntity<Student> create(
            @Valid @RequestBody StudentRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(studentService.create(request));
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Student>> getAll() {

        return ResponseEntity.ok(
                studentService.getAll()
        );
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                studentService.getById(id)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Student> update(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {

        return ResponseEntity.ok(
                studentService.update(id, request)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        studentService.delete(id);

        return ResponseEntity.noContent().build();
    }
}