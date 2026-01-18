package com.openclassrooms.starterjwt.controllers;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.test.web.servlet.MockMvc;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import com.openclassrooms.starterjwt.services.TeacherService;

@WebMvcTest(TeacherController.class)
@AutoConfigureMockMvc(addFilters = false)
class TeacherControllerTestIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private TeacherMapper teacherMapper;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private AuthEntryPointJwt unauthorizedHandler;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @Test
    void findById_shouldReturnTeacher_whenFound() throws Exception {
        // GIVEN
        Teacher teacher = Teacher.builder()
            .id(1L)
            .firstName("Alex")
            .lastName("Dubois")
            .build();
        TeacherDto dto = new TeacherDto(1L, "Dubois", "Alex", null, null);

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(dto);

        // WHEN
        mockMvc.perform(get("/api/teacher/1"))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.firstName").value("Alex"))
            .andExpect(jsonPath("$.lastName").value("Dubois"));
    }

    @Test
    void findById_shouldReturnNotFound_whenMissing() throws Exception {
        // GIVEN
        when(teacherService.findById(1L)).thenReturn(null);

        // WHEN
        mockMvc.perform(get("/api/teacher/1"))
            .andExpect(status().isNotFound());
    }

    @Test
    void findById_shouldReturnBadRequest_whenIdInvalid() throws Exception {
        // WHEN
        mockMvc.perform(get("/api/teacher/not-a-number"))
            // THEN
            .andExpect(status().isBadRequest());
    }

    @Test
    void findAll_shouldReturnTeachersList() throws Exception {
        // GIVEN
        Teacher teacher1 = Teacher.builder()
            .id(1L)
            .firstName("Test1")
            .lastName("Nom1")
            .build();
        Teacher teacher2 = Teacher.builder()
            .id(2L)
            .firstName("Test2")
            .lastName("Nom2")
            .build();
        List<Teacher> teachers = Arrays.asList(teacher1, teacher2);

        TeacherDto dto1 = new TeacherDto(1L, "Nom1", "Test1", null, null);
        TeacherDto dto2 = new TeacherDto(2L, "Nom2", "Test2", null, null);
        List<TeacherDto> dtos = Arrays.asList(dto1, dto2);

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(dtos);

        // WHEN
        mockMvc.perform(get("/api/teacher"))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].firstName").value("Test1"))
            .andExpect(jsonPath("$[0].lastName").value("Nom1"))
            .andExpect(jsonPath("$[1].id").value(2))
            .andExpect(jsonPath("$[1].firstName").value("Test2"))
            .andExpect(jsonPath("$[1].lastName").value("Nom2"));
    }

    @Test
    void findAll_shouldReturnEmptyList_whenNoTeachers() throws Exception {
        // GIVEN
        List<Teacher> emptyTeachers = Collections.emptyList();
        List<TeacherDto> emptyDtos = Collections.emptyList();
        when(teacherService.findAll()).thenReturn(emptyTeachers);
        when(teacherMapper.toDto(emptyTeachers)).thenReturn(emptyDtos);

        // WHEN
        mockMvc.perform(get("/api/teacher"))
            // THEN
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(0));
    }
}
