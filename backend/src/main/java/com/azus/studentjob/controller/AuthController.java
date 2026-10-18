package com.azus.studentjob.controller;

import com.azus.studentjob.config.OpenApiConfig;
import com.azus.studentjob.dto.request.ChangePasswordRequest;
import com.azus.studentjob.dto.request.LoginRequest;
import com.azus.studentjob.dto.request.RegisterEmployerRequest;
import com.azus.studentjob.dto.request.RegisterStudentRequest;
import com.azus.studentjob.dto.response.ApiResponse;
import com.azus.studentjob.dto.response.AuthResponse;
import com.azus.studentjob.dto.response.UserResponse;
import com.azus.studentjob.security.CustomUserDetails;
import com.azus.studentjob.security.JwtService;
import com.azus.studentjob.service.AuthService;
import com.azus.studentjob.service.AuthService.AuthResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth")
public class AuthController {

    private static final String REFRESH_COOKIE = "refresh_token";
    private static final String REFRESH_COOKIE_PATH = "/api/auth";

    private final AuthService authService;
    private final JwtService jwtService;

    @Value("${app.jwt.cookie-secure}")
    private boolean cookieSecure;

    @PostMapping("/register/student")
    @Operation(summary = "Register a student account (status ACTIVE)")
    public ResponseEntity<ApiResponse<UserResponse>> registerStudent(@Valid @RequestBody RegisterStudentRequest request) {
        UserResponse user = authService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(user, "Student account created"));
    }

    @PostMapping("/register/employer")
    @Operation(summary = "Register an employer account (status PENDING_APPROVAL until an admin approves it)")
    public ResponseEntity<ApiResponse<UserResponse>> registerEmployer(@Valid @RequestBody RegisterEmployerRequest request) {
        UserResponse user = authService.registerEmployer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(user, "Employer account created and is waiting for admin approval"));
    }

    @PostMapping("/login")
    @Operation(summary = "Login: returns the access token and sets the refresh token cookie")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return toAuthResponse(authService.login(request), "Login successful");
    }

    @PostMapping("/refresh")
    @Operation(summary = "Issue a new access token using the refresh token cookie")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken) {
        return toAuthResponse(authService.refresh(refreshToken), "Token refreshed");
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout: clears the refresh token cookie")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildRefreshCookie("", Duration.ZERO).toString())
                .body(ApiResponse.ok(null, "Logout successful"));
    }

    @GetMapping("/me")
    @Operation(summary = "Current user info", security = @SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME))
    public ResponseEntity<ApiResponse<UserResponse>> me(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(ApiResponse.ok(authService.getCurrentUser(principal.getId()), "OK"));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change the password of the current user", security = @SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME))
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Password changed"));
    }

    private ResponseEntity<ApiResponse<AuthResponse>> toAuthResponse(AuthResult result, String message) {
        ResponseCookie cookie = buildRefreshCookie(
                result.refreshToken(), Duration.ofMillis(jwtService.getRefreshExpirationMs()));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.ok(new AuthResponse(result.accessToken(), result.user()), message));
    }

    private ResponseCookie buildRefreshCookie(String value, Duration maxAge) {
        return ResponseCookie.from(REFRESH_COOKIE, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Lax")
                .path(REFRESH_COOKIE_PATH)
                .maxAge(maxAge)
                .build();
    }
}
