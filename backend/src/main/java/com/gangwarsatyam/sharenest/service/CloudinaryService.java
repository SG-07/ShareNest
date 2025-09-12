package com.gangwarsatyam.sharenest.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CloudinaryService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

    @Value("${app.debug}")
    private boolean debug;

    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.cloud_name}") String cloudName,
                             @Value("${cloudinary.api_key}") String apiKey,
                             @Value("${cloudinary.api_secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    public String uploadImage(byte[] imageBytes, String folder) throws IOException {
        if (debug) logger.debug("Uploading image to Cloudinary folder: {}", folder);

        Map uploadResult = cloudinary.uploader()
                .upload(imageBytes, ObjectUtils.asMap("folder", folder));

        String url = uploadResult.get("secure_url").toString();
        if (debug) logger.debug("Image uploaded successfully: {}", url);

        return url;
    }
}
