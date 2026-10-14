package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.User;
import com.azus.studentjob.enums.Role;
import com.azus.studentjob.enums.UserStatus;

public record UserResponse(
        Long id,
        String email,
        Role role,
        UserStatus status,
        String displayName
) {

    /** displayName: student's full name, employer's company name, or the email for admins. */
    public static UserResponse from(User user, String displayName) {
        return new UserResponse(user.getId(), user.getEmail(), user.getRole(), user.getStatus(), displayName);
    }
}
