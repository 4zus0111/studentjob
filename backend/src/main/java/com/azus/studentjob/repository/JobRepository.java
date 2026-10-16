package com.azus.studentjob.repository;

import com.azus.studentjob.entity.Job;
import com.azus.studentjob.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    Page<Job> findByEmployerId(Long employerId, Pageable pageable);

    Page<Job> findByStatus(JobStatus status, Pageable pageable);
}
