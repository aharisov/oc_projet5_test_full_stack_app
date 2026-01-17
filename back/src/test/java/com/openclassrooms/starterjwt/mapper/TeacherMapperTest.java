package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;

class TeacherMapperTest {

    private final TeacherMapper teacherMapper = Mappers.getMapper(TeacherMapper.class);

    @Test
    void toEntity_shouldMapFields() {
        // GIVEN
        TeacherDto dto = new TeacherDto(1L, "Nom", "Test", null, null);

        // WHEN
        Teacher teacher = teacherMapper.toEntity(dto);

        // THEN
        assertEquals(1L, teacher.getId());
        assertEquals("Nom", teacher.getLastName());
        assertEquals("Test", teacher.getFirstName());
    }

    @Test
    void toDto_shouldMapFields() {
        // GIVEN
        Teacher teacher = Teacher.builder()
            .id(2L)
            .lastName("Nom")
            .firstName("Test")
            .build();

        // WHEN
        TeacherDto dto = teacherMapper.toDto(teacher);

        // THEN
        assertEquals(2L, dto.getId());
        assertEquals("Nom", dto.getLastName());
        assertEquals("Test", dto.getFirstName());
    }

    @Test
    void toEntityList_shouldMapAllItems() {
        // GIVEN
        TeacherDto dto1 = new TeacherDto(1L, "Nom1", "Teacher1", null, null);
        TeacherDto dto2 = new TeacherDto(2L, "Nom2", "Teacher2", null, null);

        // WHEN
        List<Teacher> teachers = teacherMapper.toEntity(Arrays.asList(dto1, dto2));

        // THEN
        assertNotNull(teachers);
        assertEquals(2, teachers.size());
        assertEquals(1L, teachers.get(0).getId());
        assertEquals(2L, teachers.get(1).getId());
    }

    @Test
    void toDtoList_shouldMapAllItems() {
        // GIVEN
        Teacher teacher1 = Teacher.builder().id(1L).lastName("Nom1").firstName("Teacher1").build();
        Teacher teacher2 = Teacher.builder().id(2L).lastName("Nom2").firstName("Teacher2").build();

        // WHEN
        List<TeacherDto> dtos = teacherMapper.toDto(Arrays.asList(teacher1, teacher2));

        // THEN
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1L, dtos.get(0).getId());
        assertEquals(2L, dtos.get(1).getId());
    }

    @Test
    void toEntity_shouldReturnNullWhenInputNull() {
        assertNull(teacherMapper.toEntity((TeacherDto) null));
    }

    @Test
    void toDto_shouldReturnNullWhenInputNull() {
        assertNull(teacherMapper.toDto((Teacher) null));
    }

    @Test
    void toEntityList_shouldReturnNullWhenInputNull() {
        assertNull(teacherMapper.toEntity((List<TeacherDto>) null));
    }

    @Test
    void toDtoList_shouldReturnNullWhenInputNull() {
        assertNull(teacherMapper.toDto((List<Teacher>) null));
    }
}
