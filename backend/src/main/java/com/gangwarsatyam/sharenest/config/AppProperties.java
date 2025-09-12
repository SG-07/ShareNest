package com.gangwarsatyam.sharenest.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private List<String> frontendUrl;

    public List<String> getFrontendUrl() {
        return frontendUrl;
    }

    public void setFrontendUrl(List<String> frontendUrl) {
        this.frontendUrl = frontendUrl;
    }
}
