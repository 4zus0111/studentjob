package com.azus.studentjob.repository;

import com.azus.studentjob.entity.EmployerProfile;
import com.azus.studentjob.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, Long> {

    Optional<EmployerProfile> findByUserId(Long userId);

    Page<EmployerProfile> findByUserStatus(UserStatus status, Pageable pageable);
}
