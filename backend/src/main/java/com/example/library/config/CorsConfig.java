// src/main/java/com/example/library/config/CorsConfig.java
package com.example.library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",   // React dev
                        "https://myfrontend.com"   // prod
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    // Optional: expose certain headers
    @Bean
    public WebMvcConfigurer exposeHeadersConfigurer() {
        return registry -> registry.addResponseHeader("Access-Control-Expose-Headers", "Authorization");
    }
}