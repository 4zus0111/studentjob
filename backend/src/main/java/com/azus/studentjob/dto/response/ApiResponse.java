package com.azus.studentjob.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

/**
 * Wrapper for every API response. {@code errors} is only serialized when present.
 */
public record ApiResponse<T>(
        boolean success,
        T data,
        String message,
        @JsonInclude(JsonInclude.Include.NON_NULL) Map<String, String> errors
) {

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    public static <T> ApiResponse<T> error(String message, Map<String, String> errors) {
        return new ApiResponse<>(false, null, message, errors);
    }
}
