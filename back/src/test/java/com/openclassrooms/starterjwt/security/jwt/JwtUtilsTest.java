package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.security.core.Authentication;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private static final String TEST_SECRET = "testKey123456789";

    private String generateTokenHelper(String username, String secret, long expirationMs) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(SignatureAlgorithm.HS512, secret)
            .compact();
    }

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();

        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 60000);
    }

    @Test
    void generateJwtToken_shouldGenerateValidToken() {
        // GIVEN
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
            .username("test@test.com")
            .password("pwd")
            .build();

        // WHEN
        Authentication authentication = 
            new UsernamePasswordAuthenticationToken(userDetails, null);

        String token = jwtUtils.generateJwtToken(authentication);

        // THEN
        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    void getUserNameFromJwtToken_shouldReturnUsername() {
        // GIVEN
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
            .username("test@test.com")
            .build();

        Authentication authentication =
            new UsernamePasswordAuthenticationToken(userDetails, null);

        // WHEN
        String token = jwtUtils.generateJwtToken(authentication);
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // THEN
        assertEquals("test@test.com", username);
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenInvalid() {
        // GIVEN
        String invalidToken = "invalid.token.value";

        // WHEN
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        // THEN
        assertFalse(isValid);
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenSignatureInvalid() {
        // GIVEN
        String token = generateTokenHelper("test@test.com", "wrongSecretKey", 60000);

        // WHEN
        boolean result = jwtUtils.validateJwtToken(token);

        // THEN
        assertFalse(result);
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenExpired() {
        // GIVEN
        String token = generateTokenHelper("test@test.com", TEST_SECRET, -1000);

        // WHEN
        boolean result = jwtUtils.validateJwtToken(token);

        // THEN
        assertFalse(result);
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenUnsupported() {
        // GIVEN
        String token = Jwts.builder()
            .setSubject("test@test.com")
            .setIssuedAt(new Date())
            .compact();

        // WHEN
        boolean result = jwtUtils.validateJwtToken(token);

        // THEN
        assertFalse(result);
    }

    @Test
    void validateJwtToken_shouldReturnFalse_whenTokenEmpty() {
        // WHEN
        boolean result = jwtUtils.validateJwtToken("");

        // THEN
        assertFalse(result);
    }

}
