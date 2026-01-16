package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;

@ExtendWith(MockitoExtension.class)
class SessionMapperTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    private SessionMapper sessionMapper;

    @BeforeEach
    void setUp() {
        sessionMapper = Mappers.getMapper(SessionMapper.class);
        ReflectionTestUtils.setField(sessionMapper, "teacherService", teacherService);
        ReflectionTestUtils.setField(sessionMapper, "userService", userService);
    }

    @Test
    void toEntity_shouldMapFieldsAndResolveRelations() {
        // GIVEN
        SessionDto dto = new SessionDto(
            1L,
            "Yoga",
            new Date(0),
            5L,
            "Session description",
            Arrays.asList(10L, 20L),
            null,
            null
        );

        Teacher teacher = Teacher.builder().id(5L).firstName("Test").lastName("Nom").build();
        User user1 = User.builder().id(10L).email("u1@test.com").firstName("User1").lastName("Test1").password("pwd").admin(false).build();
        User user2 = User.builder().id(20L).email("u2@test.com").firstName("User2").lastName("Test2").password("pwd").admin(false).build();

        when(teacherService.findById(5L)).thenReturn(teacher);
        when(userService.findById(10L)).thenReturn(user1);
        when(userService.findById(20L)).thenReturn(user2);

        // WHEN
        Session session = sessionMapper.toEntity(dto);

        // THEN
        assertEquals(1L, session.getId());
        assertEquals("Yoga", session.getName());
        assertEquals("Session description", session.getDescription());
        assertEquals(new Date(0), session.getDate());
        assertEquals(teacher, session.getTeacher());
        assertNotNull(session.getUsers());
        assertEquals(2, session.getUsers().size());
        assertEquals(10L, session.getUsers().get(0).getId());
        assertEquals(20L, session.getUsers().get(1).getId());
    }

    @Test
    void toEntity_shouldHandleNullTeacherAndUsers() {
        // GIVEN
        SessionDto dto = new SessionDto(
            1L,
            "Yoga",
            new Date(0),
            null,
            "Session description",
            null,
            null,
            null
        );

        // WHEN
        Session session = sessionMapper.toEntity(dto);

        // THEN
        assertNull(session.getTeacher());
        assertNotNull(session.getUsers());
        assertTrue(session.getUsers().isEmpty());
    }

    @Test
    void toEntity_shouldReturnNullWhenInputNull() {
        // GIVEN
        SessionDto dto = null;

        // WHEN
        Session session = sessionMapper.toEntity(dto);

        // THEN
        assertNull(session);
    }

    @Test
    void toDto_shouldMapTeacherIdAndUserIds() {
        // GIVEN
        Teacher teacher = Teacher.builder().id(7L).firstName("Test").lastName("Nom").build();
        User user1 = User.builder().id(1L).email("u1@test.com").firstName("User1").lastName("Test1").password("pwd").admin(false).build();
        User user2 = User.builder().id(2L).email("u2@test.com").firstName("User2").lastName("Test2").password("pwd").admin(false).build();

        Session session = Session.builder()
            .id(3L)
            .name("Pilates")
            .description("Desc")
            .date(new Date(0))
            .teacher(teacher)
            .users(Arrays.asList(user1, user2))
            .build();

        // WHEN
        SessionDto dto = sessionMapper.toDto(session);

        // THEN
        assertEquals(3L, dto.getId());
        assertEquals("Pilates", dto.getName());
        assertEquals("Desc", dto.getDescription());
        assertEquals(new Date(0), dto.getDate());
        assertEquals(7L, dto.getTeacher_id());
        assertNotNull(dto.getUsers());
        assertEquals(Arrays.asList(1L, 2L), dto.getUsers());
    }

    @Test
    void toDto_shouldHandleNullTeacherAndUsers() {
        // GIVEN
        Session session = Session.builder()
            .id(3L)
            .name("Pilates")
            .description("Desc")
            .date(new Date(0))
            .teacher(null)
            .users(null)
            .build();

        // WHEN
        SessionDto dto = sessionMapper.toDto(session);

        // THEN
        assertNull(dto.getTeacher_id());
        assertNotNull(dto.getUsers());
        assertTrue(dto.getUsers().isEmpty());
    }

    @Test
    void toDto_shouldReturnNullWhenInputNull() {
        // GIVEN
        Session session = null;

        // WHEN
        SessionDto dto = sessionMapper.toDto(session);

        // THEN
        assertNull(dto);
    }

    @Test
    void toDto_shouldReturnNullTeacherIdWhenTeacherIdNull() {
        // GIVEN
        Teacher teacher = Teacher.builder().firstName("Test").lastName("Nom").build();
        Session session = Session.builder()
            .id(3L)
            .name("Pilates")
            .description("Desc")
            .date(new Date(0))
            .teacher(teacher)
            .users(null)
            .build();

        // WHEN
        SessionDto dto = sessionMapper.toDto(session);

        // THEN
        assertNull(dto.getTeacher_id());
    }

    @Test
    void toEntityList_shouldReturnNullWhenInputNull() {
        // GIVEN
        List<SessionDto> dtos = null;

        // WHEN
        List<Session> sessions = sessionMapper.toEntity(dtos);

        // THEN
        assertNull(sessions);
    }

    @Test
    void toEntityList_shouldMapAllItems() {
        // GIVEN
        SessionDto dto1 = new SessionDto(
            1L,
            "Yoga",
            new Date(0),
            null,
            "Session description",
            null,
            null,
            null
        );
        SessionDto dto2 = new SessionDto(
            2L,
            "Pilates",
            new Date(0),
            null,
            "Another description",
            null,
            null,
            null
        );

        // WHEN
        List<Session> sessions = sessionMapper.toEntity(Arrays.asList(dto1, dto2));

        // THEN
        assertNotNull(sessions);
        assertEquals(2, sessions.size());
        assertEquals(1L, sessions.get(0).getId());
        assertEquals(2L, sessions.get(1).getId());
    }

    @Test
    void toDtoList_shouldReturnNullWhenInputNull() {
        // GIVEN
        List<Session> sessions = null;

        // WHEN
        List<SessionDto> dtos = sessionMapper.toDto(sessions);

        // THEN
        assertNull(dtos);
    }

    @Test
    void toDtoList_shouldMapAllItems() {
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

        // WHEN
        List<SessionDto> dtos = sessionMapper.toDto(Arrays.asList(session1, session2));

        // THEN
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1L, dtos.get(0).getId());
        assertEquals(2L, dtos.get(1).getId());
    }
}
