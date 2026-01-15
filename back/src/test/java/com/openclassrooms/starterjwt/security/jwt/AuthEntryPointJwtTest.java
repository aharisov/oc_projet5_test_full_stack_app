package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.assertEquals;

import javax.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

class AuthEntryPointJwtTest {

    private AuthEntryPointJwt entryPoint;

    @BeforeEach
    void setUp() {
        entryPoint = new AuthEntryPointJwt();
    }

    @Test
    void commence_shouldReturnUnauthorizedResponse() throws Exception {
        // GIVEN
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServletPath("/api/test");

        MockHttpServletResponse response = new MockHttpServletResponse();

        AuthenticationException exception =
            new BadCredentialsException("Unauthorized");

        // WHEN
        entryPoint.commence(request, response, exception);

        // THEN
        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, response.getContentType());
    }
}