package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        sessionService = new SessionService(sessionRepository, userRepository);
    }

    @Test
    void create_shouldSaveSession() {
        // GIVEN
        Session session = new Session();

        when(sessionRepository.save(session)).thenReturn(session);

        // WHEN
        Session result = sessionService.create(session);

        // THEN
        assertNotNull(result);
        verify(sessionRepository).save(session);
    }

    @Test
    void delete_shouldCallRepository() {
        // GIVEN
        Long sessionId = 1L;

        // WHEN
        sessionService.delete(sessionId);

        // THEN
        verify(sessionRepository).deleteById(sessionId);
    }

    @Test
    void findAll_shouldReturnSessionsList() {
        // GIVEN
        List<Session> sessions = List.of(new Session(), new Session());

        when(sessionRepository.findAll()).thenReturn(sessions);

        // WHEN
        List<Session> result = sessionService.findAll();

        // THEN
        assertEquals(2, result.size());
        verify(sessionRepository).findAll();
    }

    @Test
    void getById_shouldReturnSession_whenExists() {
        // GIVEN
        Session session = new Session();
        Long sessionId = 1L;
        session.setId(sessionId);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // WHEN
        Session result = sessionService.getById(sessionId);

        // THEN
        assertNotNull(result);
        assertEquals(sessionId, result.getId());
    }

    @Test
    void getById_shouldReturnNull_whenSessionNotFound() {
        // GIVEN
        Long sessionId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // WHEN
        Session result = sessionService.getById(1L);

        // THEN
        assertNull(result);
    }

    @Test
    void update_shouldSetSessionIdAndSaveSession() {
        // GIVEN
        Session session = new Session();
        Long sessionId = 1L;

        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // WHEN
        Session result = sessionService.update(sessionId, session);

        // THEN
        assertNotNull(result);
        assertEquals(sessionId, session.getId());
        verify(sessionRepository).save(session);
    }

    @Test
    void participate_shouldAddUserToSession() {
        // GIVEN
        User user = new User();
        Long userId = 2L;
        user.setId(userId);

        Session session = new Session();
        Long sessionId = 1L;
        session.setId(sessionId);
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // WHEN
        sessionService.participate(sessionId, userId);

        // THEN
        assertEquals(1, session.getUsers().size());
        verify(sessionRepository).save(session);
    }

    @Test
    void participate_shouldThrowNotFound_whenSessionNotFound() {
        // GIVEN
        User user = new User();
        Long userId = 2L;
        user.setId(userId);

        Long sessionId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // THEN
        assertThrows(NotFoundException.class,
            () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void participate_shouldThrowNotFound_whenUserNotFound() {
        // GIVEN
        Session session = new Session();
        Long sessionId = 1L;
        session.setUsers(new ArrayList<>());

        Long userId = 2L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // THEN
        assertThrows(NotFoundException.class,
            () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void participate_shouldThrowBadRequest_whenUserAlreadyParticipates() {
        // GIVEN
        User user = new User();
        Long userId = 2L;
        user.setId(userId);

        Session session = new Session();
        Long sessionId = 1L;
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // THEN
        assertThrows(BadRequestException.class,
            () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void noLongerParticipate_shouldRemoveOnlyUserFromSession() {
        // GIVEN
        User user = new User();
        Long userId = 2L;
        user.setId(userId);

        Session session = new Session();
        session.setUsers(new ArrayList<>(List.of(user)));
        Long sessionId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // WHEN
        sessionService.noLongerParticipate(sessionId, userId);

        // THEN
        assertTrue(session.getUsers().isEmpty());
        verify(sessionRepository).save(session);
    }

    @Test
    void noLongerParticipate_shouldRemoveOneOfSeveralUserFromSession() {
        // GIVEN
        User user1 = new User();
        user1.setId(1L);

        User user2 = new User();
        user2.setId(2L);

        Session session = new Session();
        session.setUsers(new ArrayList<>(List.of(user1, user2)));

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // WHEN
        sessionService.noLongerParticipate(1L, 1L);

        // THEN
        assertEquals(1, session.getUsers().size());
        assertEquals(2L, session.getUsers().get(0).getId());
    }

    @Test
    void noLongerParticipate_shouldThrowNotFound_whenSessionNotFound() {
        // GIVEN
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        // THEN
        assertThrows(NotFoundException.class,
            () -> sessionService.noLongerParticipate(1L, 1L));
    }

    @Test
    void noLongerParticipate_shouldThrowBadRequest_whenUserNotParticipating() {
        // GIVEN
        Session session = new Session();
        session.setUsers(Collections.emptyList());

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        // THEN
        assertThrows(BadRequestException.class,
            () -> sessionService.noLongerParticipate(1L, 1L));
    }
}
