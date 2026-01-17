package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {
    @Mock
    private TeacherRepository teacherRepository;

    private TeacherService teacherService;

    @BeforeEach
    void setUp() {
        teacherService = new TeacherService(teacherRepository);
    }

    @Test
    void findAll_shouldReturnListOfTeachers() {
        // GIVEN
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("Lora");

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Alex");

        List<Teacher> teachers = Arrays.asList(teacher1, teacher2);

        when(teacherRepository.findAll()).thenReturn(teachers);

        // WHEN
        List<Teacher> result = teacherService.findAll();

        // THEN
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Lora", result.get(0).getFirstName());
        assertEquals("Alex", result.get(1).getFirstName());

        verify(teacherRepository).findAll();
    }

    @Test
    void findAll_shouldReturnEmptyArray_WhenThereAreNoTeachers() {
        // GIVEN
        when(teacherRepository.findAll()).thenReturn(new ArrayList<>());

        // WHEN
        List<Teacher> result = teacherService.findAll();

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(teacherRepository).findAll();
    }

    @Test
    void findById_shouldReturnTeacher_whenTeacherExists() {
    	// GIVEN
        Long teacherId = 1L;
        Teacher teacher = new Teacher();
        teacher.setId(teacherId);

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));

        // WHEN
        Teacher result = teacherService.findById(teacherId);

        // THEN
        assertNotNull(result);
        assertEquals(teacherId, result.getId());
    }

    @Test
    void findById_shouldReturnNull_whenTeacherDoesNotExist() {
    	// GIVEN
    	Long teacherId = 2L;

        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        // WHEN
        Teacher result = teacherService.findById(teacherId);

        // THEN
        assertNull(result);
    }
}
