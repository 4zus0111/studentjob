package com.azus.studentjob.service;

import com.azus.studentjob.dto.JobRequest;
import com.azus.studentjob.entity.Job;
import com.azus.studentjob.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    // CREATE
    public Job create(JobRequest request) {

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .companyName(request.getCompanyName())
                .location(request.getLocation())
                .salary(request.getSalary())
                .deadline(request.getDeadline())
                .build();

        return jobRepository.save(job);
    }

    // READ ALL
    public List<Job> getAll() {
        return jobRepository.findAll();
    }

    // READ ONE
    public Job getById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy công việc với id = " + id));
    }

    // UPDATE
    public Job update(Long id, JobRequest request) {

        Job job = getById(id);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setDeadline(request.getDeadline());

        return jobRepository.save(job);
    }

    // DELETE
    public void delete(Long id) {

        Job job = getById(id);

        jobRepository.delete(job);
    }
}