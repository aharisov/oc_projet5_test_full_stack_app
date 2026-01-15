package com.openclassrooms.starterjwt.security.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class UserDetailsImplTest {

    @Test
    void getAuthorities_shouldReturnEmptyCollection() {
        // GIVEN
        UserDetailsImpl user = UserDetailsImpl.builder()
            .id(1L)
            .username("test@test.com")
            .build();

        // THEN
        assertNotNull(user.getAuthorities());
        assertTrue(user.getAuthorities().isEmpty());
    }

    @Test
    void accountFlags_shouldAlwaysBeTrue() {
        // GIVEN
        UserDetailsImpl user = UserDetailsImpl.builder()
            .id(1L)
            .username("test@test.com")
            .build();

        // THEN
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
    }

    @Test
    void equals_shouldBeTrueForSameId() {
        // GIVEN
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();

        // THEN
        assertEquals(user1, user2);
    }

    @Test
    void equals_shouldBeTrueForSameInstance() {
        // GIVEN
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        // THEN
        assertEquals(user, user);
    }

    @Test
    void equals_shouldBeFalseWhenOtherIsNull() {
        // GIVEN
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        // THEN
        assertNotEquals(null, user);
    }

    @Test
    void equals_shouldBeFalseForDifferentId() {
        // GIVEN
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(2L).build();

        // THEN
        assertNotEquals(user1, user2);
    }

    @Test
    void equals_shouldBeFalseForDifferentClass() {
        // GIVEN
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        // THEN
        assertNotEquals(user, new Object());
    }

    @Test
    void equals_shouldBeFalseWhenIdNullAndOtherNotNull() {
        // GIVEN
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(null).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();

        // THEN
        assertNotEquals(user1, user2);
    }
}
