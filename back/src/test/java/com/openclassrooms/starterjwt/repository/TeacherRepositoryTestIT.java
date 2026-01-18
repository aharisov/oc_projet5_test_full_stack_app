package com.openclassrooms.starterjwt.repository;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

import com.openclassrooms.starterjwt.models.Teacher;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class TeacherRepositoryTestIT {

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    void existsById_shouldReturnFalse_whenMissing() {
        assertFalse(teacherRepository.existsById(1L));
    }

    @Test
    void existsById_shouldReturnTrue_whenPresent() {
        // GIVEN
        Teacher teacher = Teacher.builder()
            .firstName("Alex")
            .lastName("Dubois")
            .build();

        // WHEN
        Teacher saved = teacherRepository.save(teacher);

        // THEN
        assertTrue(teacherRepository.existsById(saved.getId()));
    }
}
