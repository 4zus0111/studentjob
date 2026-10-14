package com.azus.studentjob.dto.response;

public record AuthResponse(
        String accessToken,
        UserResponse user
) {
}
