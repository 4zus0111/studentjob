package com.azus.studentjob.config;

import com.azus.studentjob.entity.Category;
import com.azus.studentjob.entity.User;
import com.azus.studentjob.enums.Role;
import com.azus.studentjob.enums.UserStatus;
import com.azus.studentjob.repository.CategoryRepository;
import com.azus.studentjob.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the admin account and default categories on startup (only what is missing).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    // Category names are data shown in the Vietnamese UI
    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "Công nghệ thông tin",
            "Marketing",
            "Thiết kế",
            "Kinh doanh",
            "Tài chính - Kế toán",
            "Giáo dục",
            "Chăm sóc khách hàng",
            "Khác"
    );

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCategories();
    }

    private void seedAdmin() {
        String email = adminEmail.trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return;
        }
        if (adminPassword == null || adminPassword.isBlank()) {
            log.warn("ADMIN_PASSWORD is empty: admin account was not seeded");
            return;
        }
        userRepository.save(User.builder()
                .email(email)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build());
        log.info("Seeded admin account: {}", email);
    }

    private void seedCategories() {
        for (String name : DEFAULT_CATEGORIES) {
            if (!categoryRepository.existsByName(name)) {
                categoryRepository.save(Category.builder().name(name).build());
            }
        }
    }
}
