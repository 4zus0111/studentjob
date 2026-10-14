package com.azus.studentjob.service;

import com.azus.studentjob.dto.request.LoginRequest;
import com.azus.studentjob.dto.request.RegisterEmployerRequest;
import com.azus.studentjob.dto.request.RegisterStudentRequest;
import com.azus.studentjob.dto.response.UserResponse;
import com.azus.studentjob.entity.EmployerProfile;
import com.azus.studentjob.entity.StudentProfile;
import com.azus.studentjob.entity.User;
import com.azus.studentjob.enums.Role;
import com.azus.studentjob.enums.UserStatus;
import com.azus.studentjob.exception.ConflictException;
import com.azus.studentjob.exception.ForbiddenException;
import com.azus.studentjob.exception.UnauthorizedException;
import com.azus.studentjob.repository.EmployerProfileRepository;
import com.azus.studentjob.repository.StudentProfileRepository;
import com.azus.studentjob.repository.UserRepository;
import com.azus.studentjob.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /** Result of login / refresh. The refresh token goes into a cookie, never into the response body. */
    public record AuthResult(String accessToken, String refreshToken, UserResponse user) {
    }

    @Transactional
    public UserResponse registerStudent(RegisterStudentRequest request) {
        User user = createUser(request.email(), request.password(), Role.STUDENT, UserStatus.ACTIVE);

        StudentProfile profile = studentProfileRepository.save(StudentProfile.builder()
                .user(user)
                .fullName(request.fullName().trim())
                .phone(blankToNull(request.phone()))
                .build());

        return UserResponse.from(user, profile.getFullName());
    }

    @Transactional
    public UserResponse registerEmployer(RegisterEmployerRequest request) {
        // Stays PENDING_APPROVAL until an admin approves it
        User user = createUser(request.email(), request.password(), Role.EMPLOYER, UserStatus.PENDING_APPROVAL);

        EmployerProfile profile = employerProfileRepository.save(EmployerProfile.builder()
                .user(user)
                .companyName(request.companyName().trim())
                .build());

        return UserResponse.from(user, profile.getCompanyName());
    }

    @Transactional(readOnly = true)
    public AuthResult login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.email()))
                .filter(u -> passwordEncoder.matches(request.password(), u.getPassword()))
                // Same message for unknown email and wrong password
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public AuthResult refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new UnauthorizedException("Refresh token is missing");
        }
        Long userId = jwtService.parseUserId(refreshToken, JwtService.TYPE_REFRESH)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));

        return issueTokens(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Authentication required"));
        return toResponse(user);
    }

    private AuthResult issueTokens(User user) {
        if (user.getStatus() == UserStatus.LOCKED) {
            throw new ForbiddenException("Your account has been locked");
        }
        return new AuthResult(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user),
                toResponse(user));
    }

    private User createUser(String email, String rawPassword, Role role, UserStatus status) {
        String normalizedEmail = normalizeEmail(email);
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ConflictException("Email is already registered");
        }
        return userRepository.save(User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .status(status)
                .build());
    }

    private UserResponse toResponse(User user) {
        String displayName = switch (user.getRole()) {
            case STUDENT -> studentProfileRepository.findByUserId(user.getId())
                    .map(StudentProfile::getFullName).orElse(user.getEmail());
            case EMPLOYER -> employerProfileRepository.findByUserId(user.getId())
                    .map(EmployerProfile::getCompanyName).orElse(user.getEmail());
            case ADMIN -> user.getEmail();
        };
        return UserResponse.from(user, displayName);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
