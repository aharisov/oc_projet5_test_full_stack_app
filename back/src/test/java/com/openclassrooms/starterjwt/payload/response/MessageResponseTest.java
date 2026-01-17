package com.openclassrooms.starterjwt.payload.response;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class MessageResponseTest {

    @Test
    void setMessage_shouldUpdateMessage() {
        // GIVEN
        MessageResponse response = new MessageResponse("initial");

        // WHEN
        response.setMessage("updated");

        // THEN
        assertEquals("updated", response.getMessage());
    }
}
