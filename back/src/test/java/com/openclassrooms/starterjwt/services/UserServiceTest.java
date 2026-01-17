package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

	@Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository);
    }

    @Test
    void delete_shouldCallRepositoryDeleteById() {
    	// GIVEN
        Long userId = 1L;

        // WHEN
        userService.delete(userId);

        // THEN
        verify(userRepository).deleteById(userId);
    }

    @Test
    void findById_shouldReturnUser_whenUserExists() {
    	// GIVEN
        Long userId = 1L;
        User user = new User();
        user.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // WHEN
        User result = userService.findById(userId);

        // THEN
        assertNotNull(result);
        assertEquals(userId, result.getId());
    }

    @Test
    void findById_shouldReturnNull_whenUserDoesNotExist() {
    	// GIVEN
    	Long userId = 2L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // WHEN
        User result = userService.findById(userId);

        // THEN
        assertNull(result);
    }
}
