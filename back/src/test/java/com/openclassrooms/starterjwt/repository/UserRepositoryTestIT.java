package com.openclassrooms.starterjwt.repository;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import com.openclassrooms.starterjwt.models.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class UserRepositoryTestIT {

    @Autowired
    private UserRepository userRepository;

    @Test
    void existsByEmail_shouldReturnFalse_whenMissing() {
        assertFalse(userRepository.existsByEmail("missing@test.com"));
    }

    @Test
    void existsByEmail_shouldReturnTrue_whenPresent() {
        // GIVEN
        User user = new User("present@test.com", "Nom", "Test", "pwd", false);

        // WHEN
        userRepository.save(user);

        // THEN
        assertTrue(userRepository.existsByEmail("present@test.com"));
    }

    @Test
    void findByEmail_shouldReturnUser_whenPresent() {
        // GIVEN
        User user = new User("find@test.com", "Nom", "Test", "pwd", false);
        userRepository.save(user);

        // WHEN
        User found = userRepository.findByEmail("find@test.com").orElse(null);

        // THEN
        assertNotNull(found);
        assertEquals("find@test.com", found.getEmail());
    }
}
