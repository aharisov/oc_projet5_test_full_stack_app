package com.openclassrooms.starterjwt.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;

class UserMapperTest {

    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @Test
    void toEntity_shouldMapFields() {
        // GIVEN
        UserDto dto = new UserDto(1L, "test@test.com", "Nom", "Test", false, "pwd", null, null);

        // WHEN
        User user = userMapper.toEntity(dto);

        // THEN
        assertEquals(1L, user.getId());
        assertEquals("test@test.com", user.getEmail());
        assertEquals("Nom", user.getLastName());
        assertEquals("Test", user.getFirstName());
        assertEquals("pwd", user.getPassword());
        assertEquals(false, user.isAdmin());
    }

    @Test
    void toDto_shouldMapFields() {
        // GIVEN
        User user = User.builder()
            .id(2L)
            .email("user@test.com")
            .lastName("Nom")
            .firstName("Test")
            .password("pwd")
            .admin(true)
            .build();

        // WHEN
        UserDto dto = userMapper.toDto(user);

        // THEN
        assertEquals(2L, dto.getId());
        assertEquals("user@test.com", dto.getEmail());
        assertEquals("Nom", dto.getLastName());
        assertEquals("Test", dto.getFirstName());
        assertEquals("pwd", dto.getPassword());
        assertEquals(true, dto.isAdmin());
    }

    @Test
    void toEntityList_shouldMapAllItems() {
        // GIVEN
        UserDto dto1 = new UserDto(1L, "user1@test.com", "Nom1", "User1", false, "pwd", null, null);
        UserDto dto2 = new UserDto(2L, "user2@test.com", "Nom2", "User2", true, "pwd", null, null);

        // WHEN
        List<User> users = userMapper.toEntity(Arrays.asList(dto1, dto2));

        // THEN
        assertNotNull(users);
        assertEquals(2, users.size());
        assertEquals(1L, users.get(0).getId());
        assertEquals(2L, users.get(1).getId());
    }

    @Test
    void toDtoList_shouldMapAllItems() {
        // GIVEN
        User user1 = User.builder()
            .id(1L)
            .email("a@test.com")
            .lastName("UserA")
            .firstName("A")
            .password("pwd")
            .admin(false)
            .build();
        User user2 = User.builder()
            .id(2L)
            .email("b@test.com")
            .lastName("UserB")
            .firstName("B")
            .password("pwd")
            .admin(true)
            .build();

        // WHEN
        List<UserDto> dtos = userMapper.toDto(Arrays.asList(user1, user2));

        // THEN
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        assertEquals(1L, dtos.get(0).getId());
        assertEquals(2L, dtos.get(1).getId());
    }

    @Test
    void toEntity_shouldReturnNullWhenInputNull() {
        assertNull(userMapper.toEntity((UserDto) null));
    }

    @Test
    void toDto_shouldReturnNullWhenInputNull() {
        assertNull(userMapper.toDto((User) null));
    }

    @Test
    void toEntityList_shouldReturnNullWhenInputNull() {
        assertNull(userMapper.toEntity((List<UserDto>) null));
    }

    @Test
    void toDtoList_shouldReturnNullWhenInputNull() {
        assertNull(userMapper.toDto((List<User>) null));
    }
}
