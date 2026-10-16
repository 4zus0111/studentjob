package com.azus.studentjob.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

/** Keeps clients from sorting by arbitrary (or non-existent) properties. */
public final class PageUtils {

    private PageUtils() {
    }

    /** Returns the pageable unchanged if every sort property is allowed, otherwise a newest-first page. */
    public static Pageable sanitize(Pageable pageable, Set<String> allowedSortProperties) {
        for (Sort.Order order : pageable.getSort()) {
            if (!allowedSortProperties.contains(order.getProperty())) {
                return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                        Sort.by(Sort.Direction.DESC, "createdAt"));
            }
        }
        return pageable;
    }
}
