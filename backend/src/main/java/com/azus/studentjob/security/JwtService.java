package com.azus.studentjob.security;

import com.azus.studentjob.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

/**
 * Creates and validates the two JWT types used by the app.
 * Every token carries a {@code type} claim so a refresh token can never be used as an access token (and vice versa).
 */
@Slf4j
@Service
public class JwtService {

    public static final String TYPE_ACCESS = "access";
    public static final String TYPE_REFRESH = "refresh";

    private static final String CLAIM_TYPE = "type";

    private final SecretKey key;
    private final long accessExpirationMs;
    private final long refreshExpirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-expiration}") long accessExpirationMs,
            @Value("${app.jwt.refresh-expiration}") long refreshExpirationMs) {
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalStateException("app.jwt.secret (JWT_SECRET) must be at least 32 characters long");
        }
        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.accessExpirationMs = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public String generateAccessToken(User user) {
        return buildToken(user, TYPE_ACCESS, accessExpirationMs);
    }

    public String generateRefreshToken(User user) {
        return buildToken(user, TYPE_REFRESH, refreshExpirationMs);
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }

    /**
     * Returns the user id stored in the token, or empty if the token is malformed, expired,
     * badly signed, or of a different type than {@code expectedType}.
     */
    public Optional<Long> parseUserId(String token, String expectedType) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            if (!expectedType.equals(claims.get(CLAIM_TYPE, String.class))) {
                log.debug("Rejected JWT: expected type '{}'", expectedType);
                return Optional.empty();
            }
            return Optional.of(Long.valueOf(claims.getSubject()));
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("Rejected JWT: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private String buildToken(User user, String type, long expirationMs) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim(CLAIM_TYPE, type)
                .claim("role", user.getRole().name())
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(key)
                .compact();
    }
}
