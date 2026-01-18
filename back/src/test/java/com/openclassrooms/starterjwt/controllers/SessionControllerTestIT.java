package com.openclassrooms.starterjwt.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import com.openclassrooms.starterjwt.services.SessionService;

@WebMvcTest(SessionController.class)
@AutoConfigureMockMvc(addFilters = false)
class SessionControllerTestIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private AuthEntryPointJwt unauthorizedHandler;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @Test
    void findById_shouldReturnSession_whenFound() throws Exception {
        // GIVEN
        Session session = Session.builder()
            .id(1L)
            .name("Yoga")
            .description("Session description")
            .date(new Date(0))
            .build();
        SessionDto dto = new SessionDto(1L, "Yoga", new Date(0), 2L, "Session description", null, null, null);

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        // WHEN
        mockMvc.perform(get("/api/session/1"))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Yoga"))
            .andExpect(jsonPath("$.description").value("Session description"))
            .andExpect(jsonPath("$.teacher_id").value(2))
            .andExpect(jsonPath("$.date").exists());
    }

    @Test
    void findById_shouldReturnNotFound_whenMissing() throws Exception {
        // GIVEN
        when(sessionService.getById(1L)).thenReturn(null);

        // WHEN
        mockMvc.perform(get("/api/session/1"))
            // THEN
            .andExpect(status().isNotFound());
    }

    @Test
    void findById_shouldReturnBadRequest_whenIdInvalid() throws Exception {
        // WHEN
        mockMvc.perform(get("/api/session/not-a-number"))
            // THEN
            .andExpect(status().isBadRequest());
    }

    @Test
    void findAll_shouldReturnSessions() throws Exception {
        // GIVEN
        Session session1 = Session.builder()
            .id(1L)
            .name("Yoga")
            .description("Session description")
            .date(new Date(0))
            .build();
        Session session2 = Session.builder()
            .id(2L)
            .name("Pilates")
            .description("Another description")
            .date(new Date(0))
            .build();
        List<Session> sessions = Arrays.asList(session1, session2);

        SessionDto dto1 = new SessionDto(1L, "Yoga", new Date(0), 2L, "Session description", null, null, null);
        SessionDto dto2 = new SessionDto(2L, "Pilates", new Date(0), 3L, "Another description", null, null, null);
        List<SessionDto> dtos = Arrays.asList(dto1, dto2);

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(dtos);

        // WHEN
        mockMvc.perform(get("/api/session"))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].name").value("Yoga"))
            .andExpect(jsonPath("$[0].teacher_id").value(2))
            .andExpect(jsonPath("$[1].id").value(2))
            .andExpect(jsonPath("$[1].name").value("Pilates"))
            .andExpect(jsonPath("$[1].teacher_id").value(3));
    }

    @Test
    void create_shouldReturnCreatedSession() throws Exception {
        // GIVEN
        SessionDto request = new SessionDto(null, "Yoga", new Date(0), 2L, "Session description", null, null, null);
        Session session = Session.builder()
            .id(1L)
            .name("Yoga")
            .description("Session description")
            .date(new Date(0))
            .build();
        SessionDto response = new SessionDto(1L, "Yoga", new Date(0), 2L, "Session description", null, null, null);

        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(response);

        // WHEN
        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Yoga"))
            .andExpect(jsonPath("$.teacher_id").value(2))
            .andExpect(jsonPath("$.description").value("Session description"))
            .andExpect(jsonPath("$.date").exists());
    }

    @Test
    void create_shouldReturnBadRequest_whenPayloadInvalid() throws Exception {
        // GIVEN
        SessionDto request = new SessionDto();

        // WHEN
        mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            // THEN
            .andExpect(status().isBadRequest());

        verify(sessionService, never()).create(any(Session.class));
    }

    @Test
    void update_shouldReturnUpdatedSession() throws Exception {
        // GIVEN
        SessionDto request = new SessionDto(1L, "Yoga Updated", new Date(0), 2L, "Updated description", null, null, null);
        Session session = Session.builder()
            .id(1L)
            .name("Yoga Updated")
            .description("Updated description")
            .date(new Date(0))
            .build();
        SessionDto response = new SessionDto(1L, "Yoga Updated", new Date(0), 2L, "Updated description", null, null, null);

        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.update(1L, session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(response);

        // WHEN
        mockMvc.perform(put("/api/session/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Yoga Updated"))
            .andExpect(jsonPath("$.teacher_id").value(2))
            .andExpect(jsonPath("$.description").value("Updated description"))
            .andExpect(jsonPath("$.date").exists());
    }

    @Test
    void update_shouldReturnBadRequest_whenPayloadInvalid() throws Exception {
        // GIVEN
        SessionDto request = new SessionDto();

        // WHEN
        mockMvc.perform(put("/api/session/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            // THEN
            .andExpect(status().isBadRequest());

        verify(sessionService, never()).update(any(Long.class), any(Session.class));
    }

    @Test
    void update_shouldReturnBadRequest_whenIdInvalid() throws Exception {
        // GIVEN
        SessionDto request = new SessionDto(1L, "Yoga", new Date(0), 2L, "Session description", null, null, null);

        // WHEN
        mockMvc.perform(put("/api/session/not-a-number")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            // THEN
            .andExpect(status().isBadRequest());
    }

    @Test
    void delete_shouldReturnOk_whenFound() throws Exception {
        // GIVEN
        Session session = Session.builder()
            .id(1L)
            .name("Yoga")
            .description("Session description")
            .date(new Date(0))
            .build();

        when(sessionService.getById(1L)).thenReturn(session);

        // WHEN
        mockMvc.perform(delete("/api/session/1"))
            // THEN
            .andExpect(status().isOk());

        verify(sessionService).delete(1L);
    }

    @Test
    void delete_shouldReturnNotFound_whenMissing() throws Exception {
        // GIVEN
        when(sessionService.getById(1L)).thenReturn(null);

        // WHEN
        mockMvc.perform(delete("/api/session/1"))
            // THEN
            .andExpect(status().isNotFound());

        verify(sessionService, never()).delete(1L);
    }

    @Test
    void delete_shouldReturnBadRequest_whenIdInvalid() throws Exception {
        // WHEN
        mockMvc.perform(delete("/api/session/not-a-number"))
            // THEN
            .andExpect(status().isBadRequest());

        verify(sessionService, never()).delete(1L);
    }

    @Test
    void participate_shouldReturnOk_whenIdsValid() throws Exception {
        // WHEN
        mockMvc.perform(post("/api/session/1/participate/2"))
            // THEN
            .andExpect(status().isOk());

        verify(sessionService).participate(1L, 2L);
    }

    @Test
    void participate_shouldReturnBadRequest_whenIdsInvalid() throws Exception {
        // WHEN
        mockMvc.perform(post("/api/session/not-a-number/participate/2"))
            // THEN
            .andExpect(status().isBadRequest());

        verify(sessionService, never()).participate(any(Long.class), any(Long.class));
    }

    @Test
    void noLongerParticipate_shouldReturnOk_whenIdsValid() throws Exception {
        // WHEN
        mockMvc.perform(delete("/api/session/1/participate/2"))
            // THEN
            .andExpect(status().isOk());

        verify(sessionService).noLongerParticipate(1L, 2L);
    }

    @Test
    void noLongerParticipate_shouldReturnBadRequest_whenIdsInvalid() throws Exception {
        // WHEN
        mockMvc.perform(delete("/api/session/not-a-number/participate/2"))
            // THEN
            .andExpect(status().isBadRequest());

        verify(sessionService, never()).noLongerParticipate(any(Long.class), any(Long.class));
    }
}
