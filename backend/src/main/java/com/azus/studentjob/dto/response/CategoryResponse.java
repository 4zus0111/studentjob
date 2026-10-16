package com.azus.studentjob.dto.response;

import com.azus.studentjob.entity.Category;

public record CategoryResponse(Long id, String name) {

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
