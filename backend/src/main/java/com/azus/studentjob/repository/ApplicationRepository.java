package com.azus.studentjob.repository;

import com.azus.studentjob.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByJobIdAndStudentId(Long jobId, Long studentId);

    boolean existsByJobId(Long jobId);

    Page<Application> findByStudentId(Long studentId, Pageable pageable);

    Page<Application> findByJobId(Long jobId, Pageable pageable);
}
