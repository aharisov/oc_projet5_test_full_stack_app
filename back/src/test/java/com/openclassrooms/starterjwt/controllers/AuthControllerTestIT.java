package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTestIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private AuthEntryPointJwt unauthorizedHandler;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void authenticateUser_shouldReturnJwtResponse_whenUserExists() throws Exception {
        // GIVEN
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password");

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
            .id(1L)
            .username("test@test.com")
            .firstName("Test")
            .lastName("Nom")
            .admin(true)
            .build();

        Authentication authentication =
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");
        when(userRepository.findByEmail("test@test.com"))
            .thenReturn(Optional.of(new User("test@test.com", "Nom", "Test", "pwd", true)));

        // WHEN
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("jwt-token"))
            .andExpect(jsonPath("$.type").value("Bearer"))
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.username").value("test@test.com"))
            .andExpect(jsonPath("$.firstName").value("Test"))
            .andExpect(jsonPath("$.lastName").value("Nom"))
            .andExpect(jsonPath("$.admin").value(true));
    }

    @Test
    void authenticateUser_shouldReturnAdminFalse_whenUserMissing() throws Exception {
        // GIVEN
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password");

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
            .id(1L)
            .username("test@test.com")
            .firstName("Test")
            .lastName("Nom")
            .admin(false)
            .build();

        Authentication authentication =
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());

        // WHEN
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.admin").value(false));
    }

    @Test
    void authenticateUser_shouldReturnBadRequest_whenMissingFields() throws Exception {
        // GIVEN
        LoginRequest loginRequest = new LoginRequest();

        // WHEN
        mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
            // THEN
            .andExpect(status().isBadRequest());
    }

    @Test
    void registerUser_shouldReturnBadRequest_whenEmailTaken() throws Exception {
        // GIVEN
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");
        request.setFirstName("Test");
        request.setLastName("Nom");
        request.setPassword("password");

        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        // WHEN
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            // THEN
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }

    @Test
    void registerUser_shouldReturnBadRequest_whenMissingFields() throws Exception {
        // GIVEN
        SignupRequest request = new SignupRequest();

        // WHEN
        mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            // THEN
            .andExpect(status().isBadRequest());
    }

    @Test
    void registerUser_shouldRegisterUser_whenEmailAvailable() throws Exception {
        // GIVEN
        SignupRequest request = new SignupRequest();
        request.setEmail("test@test.com");
        request.setFirstName("Test");
        request.setLastName("Nom");
        request.setPassword("password");

        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");

        // WHEN
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("User registered successfully!"));

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertEquals("test@test.com", savedUser.getEmail());
        assertEquals("Nom", savedUser.getLastName());
        assertEquals("Test", savedUser.getFirstName());
        assertEquals("encoded", savedUser.getPassword());
        assertEquals(false, savedUser.isAdmin());
    }
}
