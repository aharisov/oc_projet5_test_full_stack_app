package com.openclassrooms.starterjwt.controllers;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;

import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTestIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private AuthEntryPointJwt unauthorizedHandler;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void findById_shouldReturnUser_whenFound() throws Exception {
        // GIVEN
        User user = User.builder()
            .id(1L)
            .email("test@test.com")
            .firstName("Test")
            .lastName("User")
            .password("pwd")
            .admin(false)
            .build();

        UserDto dto = new UserDto(1L, "test@test.com", "User", "Test", false, null, null, null);

        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(dto);

        // WHEN
        mockMvc.perform(get("/api/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("test@test.com"))
            .andExpect(jsonPath("$.firstName").value("Test"))
            .andExpect(jsonPath("$.lastName").value("User"))
            .andExpect(jsonPath("$.admin").value(false));
    }

    @Test
    void findById_shouldReturnUser_whenAdminTrue() throws Exception {
        // GIVEN
        User user = User.builder()
            .id(2L)
            .email("admin@test.com")
            .firstName("Admin")
            .lastName("User")
            .password("pwd")
            .admin(true)
            .build();

        UserDto dto = new UserDto(2L, "admin@test.com", "User", "Admin", true, null, null, null);

        when(userService.findById(2L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(dto);

        // WHEN
        mockMvc.perform(get("/api/user/2"))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(2))
            .andExpect(jsonPath("$.email").value("admin@test.com"))
            .andExpect(jsonPath("$.firstName").value("Admin"))
            .andExpect(jsonPath("$.lastName").value("User"))
            .andExpect(jsonPath("$.admin").value(true));
    }

    @Test
    void findById_shouldReturnNotFound_whenMissingUser() throws Exception {
        // GIVEN
        when(userService.findById(1L)).thenReturn(null);

        // WHEN
        mockMvc.perform(get("/api/user/1"))
            .andExpect(status().isNotFound());
    }

    @Test
    void findById_shouldReturnBadRequest_whenIdInvalid() throws Exception {
        mockMvc.perform(get("/api/user/not-a-number"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void delete_shouldReturnOk_whenAuthorized() throws Exception {
        // GIVEN
        User user = User.builder()
            .id(1L)
            .email("test@test.com")
            .firstName("Test")
            .lastName("User")
            .password("pwd")
            .admin(false)
            .build();

        when(userService.findById(1L)).thenReturn(user);

        // WHEN
        UserDetails principal = new org.springframework.security.core.userdetails.User(
            "test@test.com",
            "pwd",
            Collections.emptyList()
        );
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isOk());

        // THEN
        verify(userService).delete(1L);
    }

    @Test
    void delete_shouldReturnUnauthorized_whenUserMismatch() throws Exception {
        // GIVEN
        User user = User.builder()
            .id(1L)
            .email("owner@test.com")
            .firstName("Test")
            .lastName("User")
            .password("pwd")
            .admin(false)
            .build();

        when(userService.findById(1L)).thenReturn(user);

        // WHEN
        UserDetails principal = new org.springframework.security.core.userdetails.User(
            "other@test.com",
            "pwd",
            Collections.emptyList()
        );
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isUnauthorized());

        // THEN
        verify(userService, never()).delete(1L);
    }

    @Test
    void delete_shouldReturnNotFound_whenMissing() throws Exception {
        // GIVEN
        when(userService.findById(1L)).thenReturn(null);

        // WHEN
        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isNotFound());

        // THEN
        verify(userService, never()).delete(1L);
    }

    @Test
    void delete_shouldReturnBadRequest_whenIdInvalid() throws Exception {
        // WHEN
        mockMvc.perform(delete("/api/user/not-a-number"))
            .andExpect(status().isBadRequest());

        // THEN
        verify(userService, never()).delete(1L);
    }
}
