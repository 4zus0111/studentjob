package com.azus.studentjob.repository;

import com.azus.studentjob.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByJobIdAndStudentId(Long jobId, Long studentId);

    boolean existsByJobId(Long jobId);

    Optional<Application> findByJobIdAndStudentId(Long jobId, Long studentId);

    Page<Application> findByStudentId(Long studentId, Pageable pageable);

    Page<Application> findByJobId(Long jobId, Pageable pageable);
}
