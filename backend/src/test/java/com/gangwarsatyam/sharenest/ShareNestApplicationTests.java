package com.gangwarsatyam.sharenest;

import com.gangwarsatyam.sharenest.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import com.gangwarsatyam.sharenest.config.JwtFilter;

@ActiveProfiles("test")
@SpringBootTest
class ShareNestApplicationTests {

	// Mock the UserRepository so SecurityConfig can autowire it
	@MockBean
	private UserRepository userRepository;

	@MockBean
	private JwtFilter jwtFilter;

	@Test
	void contextLoads() {
		// This will pass as long as the Spring context can start
	}
}
