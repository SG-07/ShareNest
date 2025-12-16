package com.gangwarsatyam.sharenest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.gangwarsatyam.sharenest.config.AppProperties;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class ShareNestApplication {
    public static void main(String[] args) {

        // Load .env ONLY in normal run, not during tests
        if (!isTestEnvironment()) {
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();

            dotenv.entries().forEach(entry ->
                    System.setProperty(entry.getKey(), entry.getValue())
            );
        }

        SpringApplication.run(ShareNestApplication.class, args);
    }

    private static boolean isTestEnvironment() {
        return "test".equals(System.getProperty("spring.profiles.active"))
                || "test".equals(System.getenv("SPRING_PROFILES_ACTIVE"));
    }

}
