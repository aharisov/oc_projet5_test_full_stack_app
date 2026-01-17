package com.openclassrooms.starterjwt;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SpringBootSecurityJwtApplicationTestIT {
    @Test
    void main_shouldRunWithSafeArgs() {
        assertDoesNotThrow(() -> SpringBootSecurityJwtApplication.main(new String[] {
            "--spring.main.web-application-type=none",
            "--spring.main.lazy-initialization=true",
            "--server.port=0",
            "--spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration," +
                "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration," +
                "org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration"
        }));
    }
}
