// src/test/java/com/example/library/controller/UserControllerTest.java
package com.example.library.controller;

import com.example.library.dto.UserRegistrationDto;
import com.example.library.entity.User;
import com.example.library.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired MockMvc mvc;

    @MockBean UserService userService;
    @Autowired ObjectMapper objectMapper;

    @Test void registerUser_success() throws Exception {
        User user = new User(); user.setId(1L);
        when(userService.register(any())).thenReturn(user);

        UserRegistrationDto dto = new UserRegistrationDto(
                "john", "john@example.com", "Passw0rd!");

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }
}