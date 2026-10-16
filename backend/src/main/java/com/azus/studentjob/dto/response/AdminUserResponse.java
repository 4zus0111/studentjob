package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.User;
import com.azus.studentjob.enums.Role;
import com.azus.studentjob.enums.UserStatus;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String email,
        Role role,
        UserStatus status,
        String displayName,
        LocalDateTime createdAt
) {

    public static AdminUserResponse from(User user, String displayName) {
        return new AdminUserResponse(
                user.getId(), user.getEmail(), user.getRole(), user.getStatus(), displayName, user.getCreatedAt());
    }
}
