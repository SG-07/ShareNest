package com.gangwarsatyam.sharenest.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.mockito.Mockito;

@TestConfiguration
public class TestMongoConfig {

    @Bean
    public MongoTemplate mongoTemplate() {
        // Return a mock MongoTemplate so repositories can load
        return Mockito.mock(MongoTemplate.class);
    }
}
