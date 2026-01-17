package com.openclassrooms.starterjwt.security.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    private UserDetailsServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new UserDetailsServiceImpl(userRepository);
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetails() {
        // GIVEN
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setPassword("pwd");

        when(userRepository.findByEmail("test@test.com"))
            .thenReturn(Optional.of(user));

        // WHEN
        UserDetails result = service.loadUserByUsername("test@test.com");

        // THEN
        assertNotNull(result);
        assertEquals("test@test.com", result.getUsername());
    }

    @Test
    void loadUserByUsername_shouldThrowException_whenUserNotFound() {
        // GIVEN
        when(userRepository.findByEmail("test@test.com"))
            .thenReturn(Optional.empty());

        // THEN
        assertThrows(UsernameNotFoundException.class,
            () -> service.loadUserByUsername("test@test.com"));
    }
}